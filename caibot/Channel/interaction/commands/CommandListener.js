const Utils = require("../../../utils/TimeHandler");
module.exports.listen = async function(channelSettings,chatClient) {
    let commandsEnabled = channelSettings.getCommandSettings().isEnabled();
    if (commandsEnabled) {
        let listOfCommands= channelSettings.commands.commandList;
        let commandMap = new Map();
        for(let command of listOfCommands){
            commandMap.set(command.getCommandName(),command)
        }
        await startListen(channelSettings,commandMap,chatClient);
    }
}

async function startListen(channelSettings,map,chatClient) {
    chatClient.onPrivmsg(async (channel, user, message, msg) => {
        try {
            if (channel === channelSettings.channel_key){
                let initialWord = message.split(" ")[0]
                let userRank = getUserRank(msg); //saves the sending users rank
                if (map.has(initialWord)) {
                    let command = map.get(initialWord);
                    if (!command.isOnCooldown() && (userRank >= command.getPermission())){
                        let response = `@${msg.userInfo.displayName}, ${command.getResponse()}`
                        chatClient.say(channel,response);
                        console.log(`${channel} | ${Utils.getDateHHMMSS()} |  ${command.getCommandName()} | Used by ${msg.userInfo.displayName}`)
                        command.setHasCooldown(true);
                        setTimeout(function () { command.setHasCooldown(false);},command.getCooldown());
                    }
                }
            }
        }  catch (e) {
            console.log(e);
        }
    });
}

/**
 * @param msgData - meta data from twitch with all info about the msg and sending user
 * @returns {number} The rank of the user. 3 = moderator, 2 = vip, 1 = subscriber, 0 = none
 */
function getUserRank(msgData){
    if(msgData.userInfo.isMod){
        return 3
    } else if (msgData.userInfo.isVip) {
        return 2
    } else if (msgData.userInfo.isSubscriber) {
        return 1
    } else {
        return 0
    }
}