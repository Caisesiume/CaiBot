exports.isValidKey = function (channelKey) {
    if (channelKey.startsWith('#')) {
        return true;
    } else {
        return false;
    }
}