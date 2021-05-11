const {ModerationFilter} = require("./ModerationFilter");
const fWord = /\b[Ff]+[_.,\-]*? ?[aA4@]+[_., -]*? ?[\/gG6@&q]+[_., -]*? ?[\/gG6@&q]+[_., -]*? ?[\/oO0()öÖQØø°]+[_., -]*? ?[\/tT]/gmi;
class FWordFilter extends ModerationFilter{
   constructor(filterType,description,enabled, ban, timeoutLength) {
       super(filterType,description,enabled, ban, timeoutLength);
   }

    checkIfMatch(message) {
        if (fWord.exec(message)) {
            let reason = `F word | ${message}`
            return [true, this.getActionType(), reason];
        }
    }
}
module.exports.FWordFilter = FWordFilter;