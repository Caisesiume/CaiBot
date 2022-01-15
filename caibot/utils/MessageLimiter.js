/**
 * Splits a message into parts if it is too long to be sent in one message.
 * @param {String} messageToBeSent the full message that is too long for one single message.
 * @returns {Array} Each index contains a message within the char limits of < 500.
 */
 exports.messageLimiter = function (messageToBeSent) {
    let chunks = messageToBeSent.match(/.{1,499}(\s|$)/g);
    return chunks;
}