const fs = require('fs-extra');

exports.writeUpdatedChannels = async function (PATH_CHANNELS, jsonChannels) {
    let channels = JSON.stringify(jsonChannels);
    if (isValidJSON(channels)) {
        await fs.writeFile(PATH_CHANNELS, JSON.stringify(jsonChannels), function (err) {
            if (err) throw err;
        });
    } else {
        let d = new Date();
        let currentTime = d.getHours() + d.getMinutes() + d.getSeconds();
        console.log(currentTime +" | Auto save failed");
    }
}

//TODO export all botChannels.joined_channels.channel_key to currentlyRunning on boot.

function isValidJSON(inputJSON) {
    try {
        JSON.parse(inputJSON);
    } catch (error) {
        return false;
    }
    return true;
}