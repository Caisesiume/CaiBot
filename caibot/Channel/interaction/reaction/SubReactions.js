const Utils = require("../../../utils/TimeHandler");
const MessageUtils = require("../../../utils/MessageLimiter");
module.exports.listenToSubs = async function(channelSettings,chatClient) {
    let reactionsEnabled = channelSettings.getReactionSettings().isEnabled();
    if (reactionsEnabled) {
        await startSubsTracking(channelSettings,chatClient);
    }
}

async function startSubsTracking(channelSettings,chatClient) {
    const reactionSettings = channelSettings.getReactionSettings().getSettings();
    console.log(reactionSettings);
    chatClient.onSub(async (channel, user, subInfo, msg) => {
        try {
            // listen for subs 
            // When someone sub react with `subPhrase/resubPharse + subEmote x months subbed`
            if (channel === channelSettings.channel_key){
                const subPlanNew = {"1000": "Tier 1", "2000": "Tier 2", "3000": "Tier 3", "Prime": "Prime"}[subInfo.plan];
                var time = Utils.getDateHHMMSS();
                if (!reactionSettings.hasRandomEmote()) { // Has a specified on sub emote
                    switch (subPlanNew) {
                        case "Tier 2":
                            chatClient.say(channel, `${reactionSettings.getSubPhrase()} ${msg.userInfo.displayName} [${subPlanNew}] ${reactionSettings.getSubEmote()}`)
                            console.log(`${reactionSettings.getSubPhrase()} ${msg.userInfo.displayName} [${subPlanNew}] ${reactionSettings.getSubEmote()}`);
                            break;
                        case "Tier 3":
                            chatClient.say(channel, `${reactionSettings.getSubPhrase()} ${msg.userInfo.displayName} [${subPlanNew}] ${reactionSettings.getSubEmote()}`)
                            console.log(`${reactionSettings.getSubPhrase()} ${msg.userInfo.displayName} [${subPlanNew}] ${reactionSettings.getSubEmote()}`);
                            break;
                        case "Prime":
                            chatClient.say(channel, `${reactionSettings.getSubPhrase()} ${msg.userInfo.displayName} [${subPlanNew}] ${reactionSettings.getSubEmote()}`)
                            console.log(`${reactionSettings.getSubPhrase()} ${msg.userInfo.displayName} [${subPlanNew}] ${reactionSettings.getSubEmote()}`);
                            break;
                        default: 
                            chatClient.say(channel, `${reactionSettings.getSubPhrase()} ${msg.userInfo.displayName} [${subPlanNew}] ${reactionSettings.getSubEmote()}`)
                            console.log(`${reactionSettings.getSubPhrase()} ${msg.userInfo.displayName} [${subPlanNew}] ${reactionSettings.getSubEmote()}`);
                            break;
                    }
                } else { // Has random emotes enabled
                    switch (subPlanNew) {
                        case "Tier 2":
                            chatClient.say(channel, `${reactionSettings.getSubPhrase()} ${msg.userInfo.displayName} [${subPlanNew}] ${reactionSettings.getSubEmote()}`)
                            console.log(`${reactionSettings.getSubPhrase()} ${msg.userInfo.displayName} [${subPlanNew}] ${reactionSettings.getSubEmote()}`);
                            break;
                        case "Tier 3":
                            chatClient.say(channel, `${reactionSettings.getSubPhrase()} ${msg.userInfo.displayName} [${subPlanNew}] ${reactionSettings.getSubEmote()}`)
                            console.log(`${reactionSettings.getSubPhrase()} ${msg.userInfo.displayName} [${subPlanNew}] ${reactionSettings.getSubEmote()}`);
                            break;
                        case "Prime":
                            chatClient.say(channel, `${reactionSettings.getSubPhrase()} ${msg.userInfo.displayName} [${subPlanNew}] ${reactionSettings.getSubEmote()}`)
                            console.log(`${reactionSettings.getSubPhrase()} ${msg.userInfo.displayName} [${subPlanNew}] ${reactionSettings.getSubEmote()}`);
                            break;
                        default: 
                            chatClient.say(channel, `${reactionSettings.getSubPhrase()} ${msg.userInfo.displayName} [${subPlanNew}] ${reactionSettings.getSubEmote()}`)
                            console.log(`${reactionSettings.getSubPhrase()} ${msg.userInfo.displayName} [${subPlanNew}] ${reactionSettings.getSubEmote()}`);
                            break;
                    }
                }
            }
        }  catch (e) {
            console.log(e);
        }
    });

    chatClient.onResub(async(channel, user, subInfo, msg) => {
        try {
            // listen for subs 
            // When someone sub react with `subPhrase/resubPharse + subEmote x months subbed`
            if (channel === channelSettings.channel_key){
                const subPlanNew = {"1000": "Tier 1", "2000": "Tier 2", "3000": "Tier 3", "Prime": "Prime"}[subInfo.plan];
                const months = subInfo.months;
                // subEmote x Months
                if (!reactionSettings.hasRandomEmote()) {
                    const subEmote = reactionSettings.getSubEmote();
                    const subEmoteStack = await getSubEmoteStack(subEmote, months);
                    let toBeSent = `${reactionSettings.getResubPhrase()} ${msg.userInfo.displayName} [${subPlanNew}] ${subEmoteStack}`
                    if (toBeSent.length < 500) { // Limits the messages to 500 chars/msg
                        chatClient.say(channel, `${reactionSettings.getResubPhrase()} ${msg.userInfo.displayName} [${subPlanNew}] ${subEmoteStack}`)
                        console.log(`${reactionSettings.getResubPhrase()} ${msg.userInfo.displayName} [${subPlanNew}] ${subEmoteStack}`);
                    } else { // If longer msg than 500 chars, send multiple msgs
                        let splitMessageArray = MessageUtils.messageLimiter(toBeSent)
                        switch (splitMessageArray.length) {
                            case 2:
                                chatClient.say(channel, splitMessageArray[0])
                                chatClient.say(channel, splitMessageArray[1])
                                break;
                            case 3:
                                chatClient.say(channel, splitMessageArray[0])
                                chatClient.say(channel, splitMessageArray[1])
                                chatClient.say(channel, splitMessageArray[2])
                                break;
                            default:
                                chatClient.say(channel, splitMessageArray[0])
                                break;
                        }
                    }
                } else { // If channel has random emotes enabled, go here
                    switch (subPlanNew) {
                        case "Tier 2":
                            chatClient.say(channel, `${reactionSettings.getResubPhrase()} ${msg.userInfo.displayName} [${subPlanNew}] ${reactionSettings.getSubEmote()}`)
                            console.log(`${reactionSettings.getResubPhrase()} ${msg.userInfo.displayName} [${subPlanNew}] ${reactionSettings.getSubEmote()}`);
                            break;
                        case "Tier 3":
                            chatClient.say(channel, `${reactionSettings.getResubPhrase()} ${msg.userInfo.displayName} [${subPlanNew}] ${reactionSettings.getSubEmote()}`)
                            console.log(`${reactionSettings.getResubPhrase()} ${msg.userInfo.displayName} [${subPlanNew}] ${reactionSettings.getSubEmote()}`);
                            break;
                        case "Prime":
                            chatClient.say(channel, `${reactionSettings.getResubPhrase()} ${msg.userInfo.displayName} [${subPlanNew}] ${reactionSettings.getSubEmote()}`)
                            console.log(`${reactionSettings.getResubPhrase()} ${msg.userInfo.displayName} [${subPlanNew}] ${reactionSettings.getSubEmote()}`);
                            break;
                        default: 
                            chatClient.say(channel, `${reactionSettings.getResubPhrase()} ${msg.userInfo.displayName} [${subPlanNew}] ${reactionSettings.getSubEmote()}`)
                            console.log(`${reactionSettings.getResubPhrase()} ${msg.userInfo.displayName} [${subPlanNew}] ${reactionSettings.getSubEmote()}`);
                            break;
                    }
                }
            }
        }  catch (e) {
            console.log(e);
        }
    });
}


/**
 * Appends param 'emote' the amount of times, to a string. 
 * This func could use simple multiplication to reduce complexity, 
 * but I did not have the energy to re-implement this. //Caisesiume
 * eg. emote = PogChamp, months = 3. returns = PogChamp PogChamp PogChamp
 * @param {string} emote - the emote name you want to stack upon resub 
 * @param {number} months - the number of months from a resub
 */
async function getSubEmoteStack(emote, months) {
    let response = ``;
    let i = 0;
    var monthNum = parseInt(months, 10);
    while (i < monthNum) {
        i = i+1
        response += `${emote} `;
    }
    return response;
}