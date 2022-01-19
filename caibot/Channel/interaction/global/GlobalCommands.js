const {getDuration} = require("../../../utils/TimeHandler");
const REGEX = require("../../../utils/regexs");
const nukeHelp = require("./bots");
const { TimeHandler } = require("../../../utils");
const { startStateManager } = require("./StateManager/StateHandler");
module.exports.listenGlobal = async function(channelObjList,chatClient) {
    //console.log(channelObjList);
    await startGlobalListen(channelObjList,chatClient);
    await startStateManager(channelObjList,chatClient);
}

async function startGlobalListen(channelObjList, chatClient) {
    chatClient.onPrivmsg(async (channel, user, message, msg) => {
        try {
            if (message === "!ping") {
                let botUptime = getDuration(new Date() - BOT_START_DATE)
                chatClient.say(channel,`@${msg.userInfo.displayName}, Pong! Bot has been running for ${botUptime}`)
            } else if ((msg.userInfo.isMod || msg.tags.get('room-id') === msg.tags.get('user-id')) && /(!nuke)/gmi.exec(message)) {
                let regex = /!nuke (?<phrase>.{1,50}) (?<action>\d{1,6}|ban) (?<lookAhead>\d{1,6})/gmi;
                let nukeTest = regex.exec(message);
                if (nukeTest !== null) {
                    let nukedMsg = nukeTest.groups.phrase;
                    let actionType = nukeTest.groups.action;
                    let lookAheadTime = nukeTest.groups.lookAhead*1000;
                    const channelKeys = Object.keys(channelObjList);
                    for (let channelIndex of channelKeys) {
                        if (channelObjList[channelIndex].channel_key === channel) {
                            await nukeHelp.checkMsgs(chatClient, channelObjList[channelIndex],nukedMsg,actionType,lookAheadTime);
                        }
                    }
                }
                //
            } else if (message === "!log") {
                //channelObjList.getLog().print();
                console.log(msg.tags)
            }
        }  catch (e) {
            console.log(e);
        }
    });
}
