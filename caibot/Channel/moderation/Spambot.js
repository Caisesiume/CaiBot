const {ModerationFilter} = require("./ModerationFilter");
const followBotFilter = /\b(b *i *g *f *o *l *l *o *w *s *(\.|\,) *c *o *m)+/gmi;
class Spambot extends ModerationFilter{
    reason;
    constructor(filterType,description,enabled, ban, timeoutLength) {
        super(filterType,description,enabled, ban, timeoutLength);
    }

    checkIfSpambot(message,msg) {
        if (!(msg.isSubscriber() || msg.userInfo.isVip)) {
            if (followBotFilter.exec(message)) {
                this.reason = `${msg.userInfo.displayName} Auto detect [botSpam] | Banned for: ${message}`;
                return [true, this.getActionType(), this.reason];
            }
        }
    }
}
module.exports.Spambot = Spambot;