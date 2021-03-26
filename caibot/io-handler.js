const fs = require('fs-extra');


/**
 * Saves the json structure to PATH_CHANNELS
 * @param PATH_CHANNELS path to the file with channels
 * @param jsonChannels the json structure of all channels you want to save to file.
 */
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

/**
 * Adds each channel_key in each object from botChannels to an array and returns it.
 * @param botChannels channels.json but parsed.
 *
 * @returns an array including every key in botChannel.
 */
exports.getOperatingChannels = function (channelObjects) {
    let channelsArray = [];
    for (let key of channelObjects) {
        channelsArray.push(key.channel_key)
    }
    return channelsArray;
}

/**
 * Validates if an input is a JSON structure or not
 * @param inputJSON the input to be validated
 * @returns {boolean} true or false
 */
function isValidJSON(inputJSON) {
    try {
        JSON.parse(inputJSON);
    } catch (error) {
        return false;
    }
    return true;
}