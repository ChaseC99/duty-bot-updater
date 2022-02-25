'use strict';

require('dotenv').config();

const express = require('express');
const serverless = require('serverless-http')
const bodyParser = require('body-parser');
const signature = require('./verifySignature');
const payloads = require('./payloads');
const api = require('./api');
const app = express();

/*
 * Parse application/x-www-form-urlencoded && application/json
 * Use body-parser's `verify` callback to export a parsed raw body
 * that you need to use to verify the signature
 */

const rawBodyBuffer = (req, res, buf, encoding) => {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
  }
};

app.use(bodyParser.urlencoded({ verify: rawBodyBuffer, extended: true }));
app.use(bodyParser.json({ verify: rawBodyBuffer }));

/*
/* Endpoint to receive an action and a dialog submission from Slack.
/* To use actions and dialogs, enable the Interactive Components in your dev portal.
/* Scope: `command` to enable actions
 */
app.post('/updateDutyMessage', async (req, res) => {
  if (!signature.isVerified(req)) return res.status(404).send();

  const payload = JSON.parse(req.body.payload);
  const { type, user, view } = payload;

  switch (type) {
    case 'message_action':
      let result = await openModal(payload)
      if (result.error) {
        console.log(result.error);
        return res.status(500).send();
      }
      return res.status(200).send({});
    case 'view_submission':
      // Get the embedded metadata from the view
      const metadata = JSON.parse(payload.view.private_metadata)
      const selected_user = view.state.values.ra_input.multi_users_select_action.selected_user
      
      // Update the `attachments` payload to
      //  - cross out the previous line
      //  - add the new user on a new line
      var attachments = metadata.message.attachments
      const prev_lines = attachments[0].text.split("\n")          // Get a list of the previous lines
      const last_index = prev_lines.length-1                      // Save the index of the last line
      const prev_position = prev_lines[last_index].split(':')[0]  // Get the position (e.g "DC: Chase" -> "DC")
      prev_lines[last_index] = "~" + prev_lines[last_index] + "~" // Cross out the last line
      
      // Replace the old text with the crossed out previous lines + new line
      attachments[0].text = prev_lines.join('\n') + '\n' + prev_position + `: <@${selected_user}>*`
      
      // Edit message with the new attachment
      const updateData = payloads.editMessage({
        channel: metadata.message.channel,
        ts: metadata.message.ts,
        attachments: attachments,
      })
      const resp = await api.callAPIMethod('chat.update', updateData)

      // Log the updated message to #bot-playground
      const logData = {
        channel: "C0342127Y3F",
        text: `<@${user.id}> updated a message`,
        attachments: attachments 
      }
      const resp2 = await api.callAPIMethod('chat.postMessage', logData)

      // DM the user a confirmation message
      // open a DM channel with the user to receive the channel ID
      // confirmation.sendConfirmation(user.id, view);
      // TODO

      // Send a 200 respond with body to 
      // tell Slack to close the modal
      res.status(200);
      res.send({response_action: "clear"});

      return res;
  }
});

// open the dialog by calling dialogs.open method and sending the payload
const openModal = async (payload) => {

  const viewData = payloads.openModal({
    trigger_id: payload.trigger_id,
    user_id: payload.message.user,
    text: payload.message.text,
    ts: payload.message_ts,
    channel: payload.channel.id,
    original_attachments: payload.message.attachments
  })

  return await api.callAPIMethod('views.open', viewData)
};


// const server = app.listen(process.env.PORT || 3001, () => {
//   console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
// });

module.exports.handler = serverless(app);