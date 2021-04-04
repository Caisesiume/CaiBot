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
        let currentTime = d.getHours() +":"+ d.getMinutes() +":"+ d.getSeconds();
        console.log(currentTime +" | Auto save failed");
    }
}

/**
 * Adds each channel_key in each object from botChannels to an array and returns it.
 * @param channelObjects channels.json but parsed.
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

/**
 * Reads the full map of rewards from all channels
 * @returns a JSON object/ map with all channels and reward IDs.
 */
exports.getRewards = async function () {
    try {
        return JSON.parse(await fs.readFile('./rewards.json'));
    } catch (e) {
        let d = new Date();
        let currentTime = d.getHours() +":"+ d.getMinutes() +":"+ d.getSeconds();
        console.log(currentTime +" | CP Reward Request Failed");
        console.log(e)
    }
}

/**
 * Converts the map to a json object and updates the mapped rewardIDs.
 * @param rewardObject Needs to be a map eg. {'f63b4495-1abf-4a88-ba9c-bea46cf0a8e8' => 'timeout'}
 */
exports.updateRewards = async function (rewardObject) {
    try {
        const rewardJSON = Object.fromEntries(rewardObject)
        fs.writeFile('./rewards.json', JSON.stringify(rewardJSON), function (err) {
            if (err) throw err;
        });
    } catch (e) {
        let d = new Date();
        let currentTime = d.getHours() +":"+ d.getMinutes() +":"+ d.getSeconds();
        console.log(currentTime +" | CP Reward Request Failed");
        console.log(e)
    }
}