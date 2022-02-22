# Duty Bot Updater
Duty Bot Updater is an interactive Slack component that lets any Slack user updat​e the schedule posted by Duty Bot.

### User Work Flow
TODO

### App Flow 
TODO: update to remove clipit
![diagram](https://cdn.glitch.com/802be3e8-445a-4f15-9fb4-966573ebed75%2Factions_and_modals.png?v=1571270384477)

## Setup

### Create a Slack app

1. Create an app at https://api.slack.com/apps
2. Navigate to the OAuth & Permissions page and add the following bot token scopes:
    * `commands` (required for Actions)
    * `chat:write` (required to send messages as a bot user)
    * `im:write` (required to open a DM channel between your bot and a user)
3. Click 'Save Changes' and install the app

​
### Run locally 
1. Get the code
    * `git clone git@github.com:ChaseC99/duty-bot-updater.git`
    * `npm install`

2. Set the following environment variables to `.env` with your API credentials (see `.env.sample`):
    * `SLACK_ACCESS_TOKEN`: Your app's bot token, `xoxb-` token (available on the Install App page, after you install the app to a workspace once.)
    * `SLACK_SIGNING_SECRET`: Your app's Signing Secret (available on the **Basic Information** page)to a workspace)  

3. If you're running the app locally:
    1. Start the app (`npm start`)
    1. In another window, start ngrok on the same port as your webserver (`ngrok http 3000`)
​

### Configure with Slack
1. Go back to the app settings and click on **Interactive Components**.
2. Click "Enable Interactive Components" button:
    * Request URL: Your ngrok URL + `/updateDutyMessage` in the end (e.g. `https://example.ngrok.io/updateDutyMessage`)
    * Under **Actions**, click "Create New Action" button
      * Action Name: `Update Duty Member`
      * Description: `Updates the message to display the correct Duty Member`
      * Callback ID: `update_duty_member`
3. Click Save
​

## Deploying to AWS Lambda  
TODO