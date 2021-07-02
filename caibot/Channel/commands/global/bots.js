const {LookAhead} = require("./LookAhead");
exports.checkMsgs = async function(chatClient, channelSettings, removedMsg,actionType, lookAheadDuration) {
    let lookBack = [];
    let log = channelSettings.getLog();
    let channel = channelSettings.channel_key;

    while (!log.isEmpty()) {
        if (log.getFront().message.toLowerCase() === removedMsg) {
            let front = log.getFront();
            lookBack.push(front.sender);
            log.dequeue()
        } else {
            log.dequeue()
        }
    }

    await start(chatClient, lookBack, actionType, channel ,removedMsg, lookAheadDuration);
}

async function start(chatClient, lookBack, actionType, channel ,msg, lookAheadDuration) {
    let lookAheadObj = new LookAhead(chatClient,actionType, channel ,msg);
    lookAheadObj.check();
    console.log("nuke started")
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

    setTimeout(function (lookAhead) {
        lookAhead.deactivate();
    }, lookAheadDuration, lookAheadObj);
}