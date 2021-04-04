const FileHandler = require('./io-handler');
const RegexHelper = require('./regexs');

let rewardsJSON = FileHandler.getRewards();
let knownCPRewards = new Map(Object.entries(rewardsJSON));
setInterval(FileHandler.updateRewards,300000,knownCPRewards); //saves the rewards every 5 minutes.

module.exports.channelPointsTracker = async function (chatClient) {
    //Handles adding new CP rewards. CP = channel points
    chatClient.onPrivmsg(async (channel, user, message, msg) => {
        let d = new Date();
        let currentTime = d.getHours() +":"+ d.getMinutes() +":"+ d.getSeconds();
        try {
            let cpRewardID = msg.tags.get('custom-reward-id'); //gets the ID of the rewards from twitch.
            if (cpRewardID !== undefined && message.startsWith("!add")) {
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
            console.log(channel + ` | ${currentTime} | Exception`)
            console.log(e)
        }
    });

    //Handles edits of rewards.
    chatClient.onPrivmsg(async (channel, user, message, msg) => {
        let d = new Date();
        let currentTime = d.getHours() +":"+ d.getMinutes() +":"+ d.getSeconds();
        try {
            let cpRewardID = msg.tags.get('custom-reward-id'); //gets the ID of the rewards from twitch.
            if (cpRewardID !== undefined && message.startsWith("!edit")) {
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
            console.log(currentTime+ ` | ${channel} | Exception`)
            console.log(e)
        }
    });

    //TODO add a listener for the actual handling of the rewards. Actual timeouts/ban n stuff...

}