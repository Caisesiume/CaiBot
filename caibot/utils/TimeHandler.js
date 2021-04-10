/**
 * Function to reformat the timestamp
 * @param timestamp new Date;
 * @returns {string} Formatted timestamp HH:MM:SS
 */
exports.getDateHHMMSS = function (timestamp) {
    let hours = timestamp.getUTCHours() +2;
    let minutes = timestamp.getUTCMinutes();
    let seconds = timestamp.getUTCSeconds();
    hours = (hours < 10) ? '0' + hours : hours;
    minutes = (minutes < 10) ? '0' + minutes : minutes;
    seconds = (seconds < 10) ? '0' + seconds: seconds;
    return hours + ':' + minutes + ':' + seconds;
}

/**
 * Function to reformat the timestamp
 * @param timestamp new Date;
 * @returns {string} Formatted timestamp with AM/PM format
 */
exports.getDateAMPM = function (timestamp) {
    let hour = timestamp.getHours() == 0 ? 12 : (timestamp.getHours() > 12 ? timestamp.getHours() - 12 : timestamp.getHours());
    let min = timestamp.getMinutes() < 10 ? '0' + timestamp.getMinutes() : timestamp.getMinutes();
    let ampm = timestamp.getHours() < 12 ? 'AM' : 'PM';
    return hour + ':' + min + ' ' + ampm;
}