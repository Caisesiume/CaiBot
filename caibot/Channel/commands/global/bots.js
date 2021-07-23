const Utils = require("../../../utils/TimeHandler");
const {ArraySplitter} = require("../../../utils/ArraySplitter");
const {LookAhead} = require("./LookAhead");
exports.checkMsgs = async function(chatClient, channelSettings, removedMsg,actionType, lookAheadDuration) {
    let lookBack = [];
    let log = channelSettings.getLog();
    let channel = channelSettings.channel_key;
    let phrase = `${removedMsg}\\b`
    let nukeRegex = new RegExp(phrase,'gmi')
    let currentTime = Utils.getDateHHMMSS();

    while (!log.isEmpty()) {
        let messageObj = log.getFront().message;
        if (nukeRegex.test(messageObj)) {
            let front = log.getFront();
            lookBack.push(front.sender);
            log.dequeue()
        } else {
            log.dequeue()
        }
    }
    let lookBackChunks = await ArraySplitter(4, lookBack)
    console.log(lookBackChunks)

    let lookAheadObj = new LookAhead(chatClient,actionType, channel ,removedMsg);
    lookAheadObj.check();
    setTimeout(function (lookAhead) {
        lookAhead.deactivate();
    }, lookAheadDuration, lookAheadObj);

    console.log(`${channel} | ${currentTime} | Nuke for ${removedMsg} started! Users found: ${lookBack.length}`)
    for (let z = 0; z < lookBackChunks.length; z++) {
        let interval = z * 1000
        await setTimeout(lookBackHandler, interval, chatClient,lookBackChunks[z],actionType, channel ,removedMsg);
    }

}

async function lookBackHandler(chatClient, lookBack, actionType, channel ,msg) {
    if (lookBack.length > 0) {
        let isNum = /^\d+$/.test(actionType);
        for (let user of lookBack) {
            if (actionType === 'ban') {
                await chatClient.ban(channel, user, `nuked by moderator | nuked phrase: ${msg}`)
            } else if (isNum) {
                chatClient.timeout(channel, user, actionType, `nuked by moderator | nuked phrase: ${msg}`);
            }
        }
    }
}