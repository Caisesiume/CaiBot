const {getDuration} = require("../../utils/TimeHandler");
module.exports.listenGlobal = async function(chatClient) {
    await startGlobalListen(chatClient);
    async function startGlobalListen(chatClient) {
        chatClient.onPrivmsg(async (channel, user, message, msg) => {
            try {
                if (message === "!ping") {
                    let botUptime = getDuration(new Date() - BOT_START_DATE)
                    chatClient.say(channel,`@${msg.userInfo.displayName}, Pong! Bot has been running for ${botUptime}`)
                }
            }  catch (e) {
                console.log(e);
            }
        });
    }
}

