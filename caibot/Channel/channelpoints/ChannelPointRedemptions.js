const FileHandler = require('../../utils/io-handler');
const RegexHelper = require('../../utils/regexs');
const Utils = require('../../utils');

let knownCPRewards = new Map();

async function importRewards(){
    knownCPRewards = await FileHandler.getRewards();
}

function getTimeoutLength(rewardValue) {
    let timeoutCheck = RegexHelper.getDigit().exec(rewardValue);
    return timeoutCheck.groups["numbers"];
}

setInterval(FileHandler.updateRewards,300000,knownCPRewards); //saves the rewards every 5 minutes.

/**
 * Tracks channel point redemptions and handles the ones saved in rewards.json.
 */
module.exports.channelPointsTracker = async function (chatClient) {
    await importRewards();
    //Handles adding new CP rewards. CP = channel points
    chatClient.onPrivmsg(async (channel, user, message, msg) => {
        let currentTime = Utils.TimeHandler.getDateHHMMSS();
        let managingAccess = (user.toLowerCase() === channel.split('#').join('').toLowerCase()) || msg.userInfo.isMod;
        try {
            let cpRewardID = msg.tags.get('custom-reward-id'); //gets the ID of the rewards from twitch.
            if (cpRewardID !== undefined && managingAccess && message.startsWith("!add")) {
                let rewardRegex = RegexHelper.addCPType().exec(message);
                let rewardType = rewardRegex.groups["type"].toLowerCase();
                //If the rewards doesn't exist and have a valid type, then...
                if ((!(knownCPRewards.has(cpRewardID))) && (rewardType === "ban" || rewardType.startsWith("timeout"))) {
                    knownCPRewards.set(cpRewardID, rewardType);
                    chatClient.say(channel, `Added this reward as a ${rewardType} reward.`)
                    console.log(channel + ` | ${currentTime} | added new channel point reward in ${channel}`)
                }else {
                    chatClient.say(channel, `Couldn't add this reward. ${rewardType} is not a valid reward type :(`)
                    console.log(channel + ` | ${currentTime} | added a invalid reward type`)
                }
            }
        } catch (e) {
            console.log(channel + ` | ${currentTime} | Exception when adding reward in ${channel}`)
            console.log(e)
        }
    });

    //Handles edits of rewards.
    chatClient.onPrivmsg(async (channel, user, message, msg) => {
        let currentTime = Utils.TimeHandler.getDateHHMMSS();
        let managingAccess = (user.toLowerCase() === channel.split('#').join('').toLowerCase()) || msg.userInfo.isMod;
        try {
            let cpRewardID = msg.tags.get('custom-reward-id'); //gets the ID of the rewards from twitch.
            if (cpRewardID !== undefined && managingAccess && message.startsWith("!edit")) {
                let rewardRegex = RegexHelper.editCPType().exec(message);
                let rewardType = rewardRegex.groups["type"].toLowerCase();
                if (rewardType === "ban" || rewardType.startsWith("timeout")) {
                    knownCPRewards.set(cpRewardID,rewardType);
                    chatClient.say(channel, `Changed this reward to a ${rewardType} reward!`)
                    console.log(channel + ` | ${currentTime} | edited channel point reward in ${channel} to ${rewardType}`);
                } else {
                    chatClient.say(channel, `Couldn't change this reward. ${rewardType} is not a valid reward type :(`)
                    console.log(channel + ` | ${currentTime} | changed to a invalid reward type`)
                }
            }
        } catch (e) {
            console.log(channel + ` | ${currentTime} | Exception when editing reward in ${channel}`)
            console.log(e)
        }
    });

    //Take action on
    chatClient.onPrivmsg(async (channel, user, message, msg) => {
        let currentTime = Utils.TimeHandler.getDateHHMMSS();
        let twitchUsername = msg.userInfo.displayName; //To get correct capitalization
        try {
            let cpRewardID = msg.tags.get('custom-reward-id');
            if (cpRewardID !== undefined && !(message.startsWith("!"))) {
                let rewardValue = knownCPRewards.get(cpRewardID);
                if (rewardValue !== undefined) {
                    let isTimeout = rewardValue.startsWith("timeout");
                    if (rewardValue === "ban") {
                        if (message.includes("@")) {
                            let userCheck = RegexHelper.getAtUsername().exec(message);
                            let foundUser = userCheck.groups["username"];
                            chatClient.ban(channel, `${foundUser} ${twitchUsername} banned you using channel points`);
                            console.log(channel + ` | ${currentTime} | #REDEMPTION ${twitchUsername} banned ${foundUser}`);
                        } else {
                            let userCheck = RegexHelper.getUsername().exec(message);
                            let foundUser = userCheck.groups["username"];
                            chatClient.ban(channel, `${foundUser} ${twitchUsername} banned you using channel points`);
                            console.log(channel + ` | ${currentTime} | #REDEMPTION ${twitchUsername} banned ${foundUser}`);
                        }
                    } else if (isTimeout) { //One if message includes @ and one takes the first word in the message.
                        let timeoutLength = getTimeoutLength(rewardValue);
                        if (message.includes("@")) {
                            let userCheck = RegexHelper.getAtUsername().exec(message);
                            let foundUser = userCheck.groups["username"];
                            chatClient.timeout(channel, `${foundUser} ${timeoutLength} ${twitchUsername} timed you out with channel points`);
                            console.log(channel + ` | ${currentTime} | #REDEMPTION ${twitchUsername} timed out ${foundUser} for ${timeoutLength}s`);
                        } else {
                            let userCheck = RegexHelper.getUsername().exec(message);
                            let foundUser = userCheck.groups["username"];
                            chatClient.timeout(channel, `${foundUser} ${timeoutLength} ${twitchUsername} timed you out with channel points`);
                            console.log(channel + ` | ${currentTime} | #REDEMPTION ${twitchUsername} timed out ${foundUser} for ${timeoutLength}s`);
                        }
                    }
                }
            }
        }catch (e) {
            console.log(channel + ` | ${currentTime} | Exception on redemption by ${twitchUsername}`)
            console.log(e)
        }
    });
}