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
 * Regex used to extract a word beginning with @ of length 3-24.
 * Use group "username"
 * @returns {RegExp}
 */
module.exports.getAtUsername = function () {
    return /@(?<username>[\d\w]{3,24})/gmi;
}