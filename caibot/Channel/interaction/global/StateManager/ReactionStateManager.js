const REGEX = require("../../../../utils/regexs");
const { TimeHandler } = require("../../../../utils");

/**
 * Only accessable function in the file, used to start the listener. 
 * Listens in all connected channels.
 * Listener tracks all the change requests in regards to reactions through the chat. 
 * Triggers on !module reactions 'state' 
 * 
 * @param {Object} channelObj - main object containing all settings for all channels.
 * @param {Object} chatClient - client object connected to the twitch api and irc server.
 */
module.exports.startReactionManager = async function (channelObj, chatClient) {
    await reactionStateManager(channelObj, chatClient);
}


/**
 * Function first runs the listener upon being called.
 * Upon event, in form of a message, the function checks the conditional statements
 * If conditional statements are fulfilled, the function will change the state of
 * the channel in question's reaction settings.
 * 
 * @param {Object} chanenlInfo - main object containing all settings from all channels.
 * @param {Object} chatClient - client object connected to the twitch api and irc server.
 */
async function reactionStateManager(chanenlInfo, chatClient) {
    chatClient.onPrivmsg(async (channel, user, message, msg) => {
        try {
            let messageLower = message.toLowerCase();
            if ((msg.userInfo.isMod || msg.tags.get('room-id') === msg.tags.get('user-id'))&& messageLower.startsWith("!module reactions")) { 
                //Only cares about messages starting with '!module reactions'
                //Message need to be sent by a chat moderator or the channel owner.

                let validCommand = REGEX.moduleUpdateSplit().exec(message); //Imports a regex 
                let channelToEdit = await findChannelObject(chanenlInfo, channel); //Returns the channel settings from the channel the message was in
                let updateModule = validCommand.groups["moduleToUpdate"].toLowerCase(); //Gets the 2nd 

                if (validCommand) {
                    console.log("is valid");
                    let state = validCommand.groups["state"].toLowerCase(); // Gets the last word of the command phrase. (should be on/off/enable/disable)
                    let currentState = channelToEdit.getReactionSettings().isEnabled(); //Check if the channel have reactions enabled.

                    if (state === "on" || state === "enable") { //If user wants to enable reactions
                        if (!currentState) { //If reactions are disabled
                            channelToEdit.getReactionSettings().setEnabled(channel, true); //Sets the state of reactions to Enabled
                            console.log(`${TimeHandler.getDateHHMMSS()} | ${msg.userInfo.displayName} Enabled Sub Reactions in ${channel}`);
                            chatClient.say(channel, `@${msg.userInfo.displayName}, Successfully enabled sub reactions! PogChamp`)

                        } else { //If reactions already enabled
                            chatClient.say(channel, `@${msg.userInfo.displayName}, This module is already enabled!`)
                        }

                    } else if (state === "off" || state === "disable") { //User wants to turn off/disable reactions
                        if (currentState) { //If enabled
                            channelToEdit.getReactionSettings().setEnabled(channel, false); //Sets the state of the channels reactions to Disabled
                            console.log(`${TimeHandler.getDateHHMMSS()} | ${msg.userInfo.displayName} Disabled Sub Reactions in ${channel}`);
                            chatClient.say(channel, `@${msg.userInfo.displayName},  Sub reactions are now disabled!`)
                        
                        } else {
                            chatClient.say(channel, `@${msg.userInfo.displayName}, This module is already disabled!`)
                        }
                    } else { // If the provided third word is not a valid state, the user will be informed. (ex. !module reactions lol) 
                        console.log(`${TimeHandler.getDateHHMMSS()} | ${msg.userInfo.displayName} attempted to change state of reactions in ${channel}`);
                        chatClient.say(channel, `@${msg.userInfo.displayName}, I am not sure 🤔 Do you want to enable or disable this module? <!module moduleName on/off>`)
                    }
                } 
            }
        } catch (e) {
            console.log(e);
            console.log("Server Error in State Manager. root/Channel/interaction/global/StateManager/RactionStateManager.js");
        }
    })
}


/**
 * Searches for the channel provided in params. 
 * When found, function returns the channel object
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