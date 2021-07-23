const {FWordFilter} = require("./FWordFilter");
const {NWordFilter} = require("./NWordFilter");
const {Spambot} = require("./Spambot");
const {Ascii} = require("./Ascii");
const {SelfPromotion} = require("./SelfPromotion");

class Moderation {
    constructor(enabled) {
        this.enabled = enabled;
        this.filters = {
            "ascii": new Ascii("ascii","Removes larger Ascii arts from chat.",true,false,3),
            "selfpromo": new SelfPromotion("selfpromo","Checks if the message is self promotion (linking own channel)", true, false, 600),
            "spambot": new Spambot("spambot","Bans users posting bot spam including bigfollow.com link",true,true,0),
            "nword": new NWordFilter("nword","Bans users using the nword in any context",true,true,0),
            "fword": new FWordFilter("fword","Times out users using the f word in any context", true,false,86400)
        }
    };

    async checkFilters(message,user,msg) {
        if (this.filters.ascii.isEnabled()) {
            let ascii = await this.filters.ascii.checkIfAscii(message,msg);
            if (ascii !== undefined) {
                return ascii;
            }
        }
        if (this.filters.selfpromo.isEnabled()) {
            let selfpromo = await this.filters.selfpromo.selfPromoCheck(message,user);
            if (selfpromo !== undefined) {
                return selfpromo;
            }
        }
        if (this.filters.spambot.isEnabled()) {
            let spambot = await this.filters.spambot.checkIfSpambot(message,msg)
            if (spambot !== undefined) {
                return spambot;
            }
        }
        if (this.filters.nword.isEnabled()) {
            let nWord = await this.filters.nword.checkIfMatch(message)
            if (nWord !== undefined) {
                return nWord;
            }
        }
        if (this.filters.fword.isEnabled()) {
            let fWord = await this.filters.nword.checkIfMatch(message)
            if (fWord !== undefined) {
                return fWord;
            }
        }
    }

    async setFilters(jsonStructure) {
        let jsonFilter = jsonStructure.filters;
        this.filters = {
            "ascii": new Ascii("ascii",jsonFilter.ascii.description,jsonFilter.ascii.enabled,jsonFilter.ascii.ban,jsonFilter.ascii.timeoutLength),
            "selfpromo": new SelfPromotion("selfpromo",jsonFilter.selfpromo.description,jsonFilter.selfpromo.enabled,jsonFilter.selfpromo.ban,jsonFilter.selfpromo.timeoutLength),
            "spambot": new Spambot("spambot",jsonFilter.spambot.description,jsonFilter.spambot.enabled,jsonFilter.spambot.ban,jsonFilter.spambot.timeoutLength),
            "nword": new NWordFilter("nword",jsonFilter.nword.description,jsonFilter.nword.enabled,jsonFilter.nword.ban,jsonFilter.nword.timeoutLength),
            "fword": new FWordFilter("fword",jsonFilter.fword.description,jsonFilter.fword.enabled,jsonFilter.fword.ban,jsonFilter.fword.timeoutLength)
        }
    }

    setEnableOrDisable(inputBool) {
        this.enabled = inputBool;
    }

    isActive() {
       return this.enabled === true;
    }

}
module.exports.Moderation = Moderation;
