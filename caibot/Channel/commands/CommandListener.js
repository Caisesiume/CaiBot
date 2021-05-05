const Utils = require("../../utils/TimeHandler");
module.exports.listen = async function(channelSettings,chatClient) {
    /*if (commands) {
        await startListen(commands,chatClient);
    }*/
}

async function startListen(commands,chatClient) {
    chatClient.onPrivmsg(async (channel, user, message, msg) => {
        try {

        }  catch (e) {
            console.log(e);
        }
    });
}