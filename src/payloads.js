module.exports = {
    openModal: context => {
        return {
            token: process.env.SLACK_ACCESS_TOKEN,
            trigger_id: context.trigger_id,
            view: {
                type: 'modal',
                title: {
                    type: 'plain_text',
                    text: 'Update Duty Member',
                    emoji: true
                },
                private_metadata: `{"message": {"attachments": ${JSON.stringify(context.original_attachments)},"ts": "${context.ts}", "channel": "${context.channel}"}}`,
                submit: {
                    type: 'plain_text',
                    text: 'Update',
                },
                close: {
                    type: 'plain_text',
                    text: 'Cancel',
                },
                blocks: [
                    {
                        type: "input",
                        block_id: "ra_input",
                        element: {
                            type: "users_select",
                            placeholder: {
                                type: "plain_text",
                                text: "Select users",
                                emoji: true
                            },
                            action_id: "multi_users_select_action"
                        },
                        label: {
                            type: "plain_text",
                            text: "Select an RA",
                            emoji: true
                        }
                    }
                ],
                callback_id: 'dutybot_update',
            }
        }
    },
    editMessage: context => {
        return {
            token: process.env.SLACK_ACCESS_TOKEN,
            channel: context.channel,
            ts: context.ts,
            attachments: context.attachments
        }
    },
    confirmation: context => {
        
        return {
            channel: context.channel_id,
            text: `<@${context.user_id}>`
        }
    }
}