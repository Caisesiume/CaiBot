const {ModerationFilter} = require("./ModerationFilter");
const getUsername = /(twitch\.tv\/(?<username>[A-Za-z0-9.]{3,24}))/gmi;
const clipCheck = /clip/gmi;
const videoCheck = /video/gmi;

class SelfPromotion extends ModerationFilter{
    reason;
    constructor(filterType,description,enabled, ban, timeoutLength) {
        super(filterType,description,enabled, ban, timeoutLength)
    }

    /**
     *
     * @param message string to be checked for selfpromo.
     * @param user the user sending the string
     * @returns {Promise<(boolean|string|*)[]>}  [boolean, string, string]
     */
    async selfPromoCheck(message, user) {
        let matchSelfPromo = getUsername.exec(message);
        if (matchSelfPromo && (!(videoCheck.exec(message)) && !(clipCheck.exec(message)))) {
            let selfPromoNotice = matchSelfPromo.groups['username'];
            if (selfPromoNotice.toLowerCase() === user.toLowerCase()) {
                this.reason = `Posted Self promo link | message: ${message}`;
                return [true, this.getActionType(), this.reason]
            }
        }
    }
}
module.exports.SelfPromotion = SelfPromotion;