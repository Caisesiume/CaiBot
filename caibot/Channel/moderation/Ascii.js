const {ModerationFilter} = require("./ModerationFilter");
acceptedAsciiChar = [33, 36, 40, 41, 46, 58, 60, 62, 63, 92, 94, 163,196, 197, 214, 216, 228, 229, 246, 248];
regexEmojis = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c\ude32-\ude3a]|[\ud83c\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/gi;

class Ascii extends ModerationFilter{

    constructor(filterType,description,enabled, ban, timeoutLength) {
        super(filterType,description,enabled, ban, timeoutLength)
    }
    /**
     * Get the unicode code of an emoji in base 16.
     * @function
     * @param {String} input The emoji character.
     * @returns {Number} The unicode code.
     */
    getEmojiUnicode(input) {
        if (input.length === 1) {
            return input.charCodeAt(0);
        }
        let comp = (
            (input.charCodeAt(0) - 0xD800) * 0x400
            + (input.charCodeAt(1) - 0xDC00) + 0x10000
        );
        if (comp < 0) {
            return input.charCodeAt(0);
        }
        return comp;
    };

    /**
     * Checks if a message is ascii art/emoji spam
     * @param message the message to be checked.
     * @param msg the meta data containing the message.
     * @returns {Promise<(boolean|string|string)[]>} [boolean, string, string] boolean -> weather it's ascii or not.
     *  string-> action type. string -> reason.
     */
    async checkIfAscii(message, msg) {
        let nonAlnum = 0;
        let emojiProcent = 0;
        let reason = "";
        let str = message;

        const count = (message) => {
            return ((message || '').match(regexEmojis) || []).length
        }

        let emojisInMessageCount = count(message);
        for (let char of str) {
            let code = this.getEmojiUnicode(char);
            if (!(code > 47 && code < 58) && !(acceptedAsciiChar.includes(code)) && !(code > 64 && code < 91) && !(code > 96 && code < 123)) { // not numeric (0-9) && not upper alpha (A-Z) && not lower alpha (a-z) &&
                nonAlnum += 1;
            }
        }
        if (emojisInMessageCount >= 0 && emojisInMessageCount < 150) {
            emojiProcent = emojisInMessageCount/message.length;
            reason = "Posting ascii art in chat FeelsWeirdMan";
        } else if (emojisInMessageCount > 149) {
            reason = "Posting Emoji Walls in chat FeelsWeirdMan"
        }
        let ratioWithoutEmojis = nonAlnum/message.length;
        let ratio;
        if (ratioWithoutEmojis !== emojisInMessageCount/message.length) {
            ratio = ratioWithoutEmojis - emojiProcent;
        } else {
            ratio = ratioWithoutEmojis;
        }
        if ((((message.length > 240) && ratio > 0.8) || (message.length > 7 && ratio > 0.87)) || emojisInMessageCount > 149) {
            if (!(msg.userInfo.isVip) && !(msg.isCheer())) {
                return [true, this.getActionType(), reason];
            }
        }
    }
}
module.exports.Ascii = Ascii;