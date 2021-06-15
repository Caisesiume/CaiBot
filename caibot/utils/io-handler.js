const fs = require('fs-extra');


/**
 * Saves the json structure to PATH_CHANNELS
 * @param PATH_CHANNELS path to the file with channels
 * @param jsonChannels the json structure of all channels you want to save to file.
 */
exports.writeUpdatedChannels = async function (PATH_CHANNELS, jsonChannels) {
    let jsonToBeModified = jsonChannels;
    let jsonToBeSaved = removeUnusedData(jsonToBeModified)
    let channels = JSON.stringify(jsonToBeSaved);
    if (isValidJSON(channels)) {
        await fs.writeFile(PATH_CHANNELS, channels, function (err) {
            if (err) throw err;
        });
    } else {
        let d = new Date();
        let currentTime = d.getHours() +":"+ d.getMinutes() +":"+ d.getSeconds();
        console.log(currentTime +" | Auto save failed");
    }
}


/**
 * Removes unnecessary data from the json structure that is about to be saved.
 * This is to minimize the amount of redundant data.
 * @param jsonArray the data of all channels that is about to be saved to disk
 * @returns {*} returns the new modified file, but without logs and recently timed out users saved.
 */
function removeUnusedData(jsonArray) {
    let channels = jsonArray.joined_channels;
    for (let channel of channels) {
        channel.recentTimeouts = [];
        channel.msgLog = {};
    }
    return jsonArray;
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
 * @returns a map with all channels and reward IDs.
 */
exports.getRewards = async function () {
    try {
        let objJSON = JSON.parse(await fs.readFile('./Channel/channelpoints/rewards.json'));
        let rewardMap = new Map();
        for (let k of Object.keys(objJSON)) {
            rewardMap.set(k, objJSON[k]);
        }
        return rewardMap;
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
        fs.writeFile('./Channel/channelpoints/rewards.json', JSON.stringify(rewardJSON), function (err) {
            if (err) throw err;
        });
    } catch (e) {
        let d = new Date();
        let currentTime = d.getHours() +":"+ d.getMinutes() +":"+ d.getSeconds();
        console.log(currentTime +" | CP Reward Request Failed");
        console.log(e)
    }
}