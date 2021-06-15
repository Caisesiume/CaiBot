/**
 * Function to reformat the timestamp
 * @returns {string} Formatted timestamp HH:MM:SS
 */
exports.getDateHHMMSS = function () {
    let timestamp = new Date();
    return timestamp.toLocaleTimeString([],
        {
            hourCycle: 'h23',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
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

/**
 * Returns a formatted string containing a more explicit presentation of a time duration
 * @param difference - the duration in milliseconds to be formatted
 * @returns {string} - formatted duration string
 */
exports.getDuration = function (difference) {
    let hours = difference / (1000*60*60);
    let absoluteHours = Math.floor(hours);
    let h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours;
    let minutes = (hours - absoluteHours) * 60;
    let absoluteMinutes = Math.floor(minutes);
    let m = absoluteMinutes > 9 ? absoluteMinutes : '0' +  absoluteMinutes;
    let seconds = (minutes - absoluteMinutes) * 60;
    let absoluteSeconds = Math.floor(seconds);
    let s = absoluteSeconds > 9 ? absoluteSeconds : '0' + absoluteSeconds;
    let d = Math.floor(absoluteHours/24);
    let remainingH = absoluteHours - (d*24);
    if ((h === '00' && m === '00') && d < 1) {
        return s + ' Seconds!';
    } else if ((h === '00' && m !== '00') && d < 1){
        return m + ' Minutes ' + s + ' Seconds!';
    } else if (d > 0) {
        return d + ' Days ' + remainingH + ' Hours!';
    } else {
        return h + ' Hours ' + m + ' Minutes!';
    }
}