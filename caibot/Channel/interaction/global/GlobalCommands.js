const {getDuration} = require("../../../utils/TimeHandler");
const REGEX = require("../../../utils/regexs");
const nukeHelp = require("./bots");
const { TimeHandler } = require("../../../utils");
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

async function startStateManager(chanenlInfo, chatClient) {
    chatClient.onPrivmsg(async (channel, user, message, msg) => {
        try {
            if(msg.userInfo.isMod && message.startsWith("!module")) {
                let validCommand = REGEX.moduleUpdateSplit().exec(message);
                let channelToEdit = await findChannelObject(chanenlInfo, channel);
                if (validCommand) {
                    console.log("is valid");
                    let updateModule = validCommand.groups["moduleToUpdate"].toLowerCase();
                    let state = validCommand.groups["state"].toLowerCase();
                    switch (updateModule) {
                        case "reaction": // Reactions === Sub Reactions/ Resub Reactions
                            let currentState = channelToEdit.getReactionSettings().isEnabled(); //Boolean
                            if (state === "on" || state === "enable") {
                                if (!currentState) {
                                    channelToEdit.getReactionSettings().setEnabled(channel, true);
                                    console.log(`${TimeHandler.getDateHHMMSS()} | ${msg.userInfo.displayName} Enabled Sub Reactions in ${channel}`);
                                    chatClient.say(channel, `@${msg.userInfo.displayName}, Successfully enabled sub reactions! PogChamp`)
                                } else {
                                    chatClient.say(channel, `@${msg.userInfo.displayName}, This module is already enabled!`)
                                }
                            } else if (state === "off" || state === "disable") {
                                if (currentState) {
                                    channelToEdit.getReactionSettings().setEnabled(channel, false);
                                    console.log(`${TimeHandler.getDateHHMMSS()} | ${msg.userInfo.displayName} Disabled Sub Reactions in ${channel}`);
                                    chatClient.say(channel, `@${msg.userInfo.displayName},  Sub reactions are now disabled!`)
                                } else {
                                    chatClient.say(channel, `@${msg.userInfo.displayName}, This module is already disabled!`)
                                }
                            } else {
                                console.log(`${TimeHandler.getDateHHMMSS()} | ${msg.userInfo.displayName} attempted to change state of reactions in ${channel}`);
                                chatClient.say(channel, `@${msg.userInfo.displayName}, I am not sure 🤔 Do you want to enable or disable this module? <!module moduleName on/off>`)
                            }
                            break;
                        case "commands":
                            break;
                        case "moderation":
                            break;
                        default:
                            break;
                    }
                }
            }
        } catch (e) {
            console.log(e);
            console.log("Error in State Manager. GlobalCommmands.js");
        }
    })
}


/**
 * 
 * @param {ObjectArray} channellList containing a list of all settings from all channels.
 * @param {String} channel - the channel from which the data is requested.
 * @returns if successfully found, returns the channel object.
 */
async function findChannelObject(channellList, channel) {
    const channelKeys = Object.keys(channellList);
    for (let channelIndex of channelKeys) {
        if (channellList[channelIndex].channel_key === channel) {
            return channellList[channelIndex];
        }
    }
}