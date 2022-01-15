/**
 * Regex used to extract a string following after !add.
 * Use group "type"
 * @returns {RegExp}
 */
module.exports.addCPType = function () {
    return /!add reward +(?<type>[\d\w]{3,12})/gmi;
}

/**
 * Regex used to extract a string following after !edit.
 * Use group "type"
 * @returns {RegExp}
 */
module.exports.editCPType = function () {
    return /!edit reward +(?<type>[\d\w]{3,12})/gmi;
}

/**
 * Regex used to extract digits at the end of a string.
 * Use group "numbers"
 * @returns {RegExp}
 */
module.exports.getDigit = function () {
    return /(?<numbers>\d{0,5})$/gmi;
}

/**
 * Regex used to get a word at start of line of length 3-24.
 * Use group "username"
 * @returns {RegExp}
 */
module.exports.getUsername = function () {
    return /^(?<username>[\d\w]{3,24})/gmi;
}

/**
 * Regex used to extract a username beginning with @ of length 3-24.
 * Use group "username"
 * @returns {RegExp}
 */
module.exports.getAtUsername = function () {
    return /@(?<username>[\d\w]{3,24})/gmi;
}

/**
 * Regex used to extract the username in a twitch.tv/username link.
 * Use group "username"
 * @returns {RegExp}
 */
module.exports.getTwitchNickFromLink = function () {
    return /(twitch\.tv\/(?<username>[A-Za-z0-9.]{3,24}))/gmi;
}

/**
 * Regex used to check if the word clip is included in a string.
 * @returns {RegExp}
 */
module.exports.clipCheck = function () {
    return /clip/gmi;
}

/**
 * Regex used to check if the word video is included in a string.
 * @returns {RegExp}
 */
module.exports.videoCheck = function () {
    return /video/gmi;
}

/**
 * Regex used to split the update command to its three components.
 * !module command identifyer
 * Group moduleToUpdate - the module to update.
 * Group state - Enable/Disable.
 * @returns {RegExp}
 */
 module.exports.moduleUpdateSplit = function () {
    return/!module +(?<moduleToUpdate>[\d\w]{3,12}) +(?<state>[\d\w]{3,12})/gmi;
}
