const Utils = require("../../utils/TimeHandler");
module.exports.listen = async function(channelSettings,chatClient) {
    let moderation = channelSettings.getModeration().isActive()
    if (moderation) {
        await startListen(channelSettings,chatClient);
    }
}

async function startListen(channelSettings,chatClient) {
    chatClient.onPrivmsg(async (channel, user, message, msg) => {
        try {
            //if message is from the channel in fact & is not mod & is not the broadcaster.
            if (channel === channelSettings.channel_key && !msg.userInfo.isMod && user.toLowerCase() !== channelSettings.channel_name) {

                let currentTime = Utils.getDateHHMMSS();
                let twitchUsername = msg.userInfo.displayName;
                let actionDetails = await channelSettings.moderationSettings.checkFilters(message,user,msg, channelSettings.socials);
            
                if (actionDetails !== undefined) {
                    let takeAction = actionDetails[0];
                    let timeoutLength = actionDetails[1];
                    let reason = actionDetails[2];
                    
                    if (takeAction) {

                        if (timeoutLength === "ban") {
                            await chatClient.ban(channel, user, reason);
                            console.log(channel + ` | ${currentTime} | #BAN ${twitchUsername} banned for: ${reason}`);

                        } else {
                            let timeoutLength2 = await channelSettings.setNewTimeout(user,timeoutLength)
                            await chatClient.timeout(channel, `${user} ${timeoutLength2} ${reason} | `)
                            console.log(channel + ` | ${currentTime} | #TIMEOUT ${twitchUsername} timeout for ${timeoutLength2}s. Reason: ${reason}`);
                        }

                    }
                }
                await channelSettings.addToTempLog(message,user,msg);
            }
        }  catch (e) {
            console.log(e);
        }
    });
}