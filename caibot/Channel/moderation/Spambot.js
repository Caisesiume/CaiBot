const {ModerationFilter} = require("./ModerationFilter");
const followBotFilter = /\b(b *i *g *f *o *l *l *o *w *s *(\.|\,) *c *o *m)+/gmi;
const followBotFilter2 =  /\b(y *o *u *r *f *o *l *l *o *w *z *(\.|\,) *c *o *m)+/gmi;
const linkFilter1 = /\b(c*u*t*t(\.|\,) *(l*y*\/))+/gmi;
const linkFilter2 = /\b(b*i*t(\.|\,) *(l*y*\/))+/gmi;
const linkFilter3 = /\b(t*(\.|\,) *(l*y*\/))+/gmi;
class Spambot extends ModerationFilter{
    reason;
    constructor(filterType,description,enabled, ban, timeoutLength) {
        super(filterType,description,enabled, ban, timeoutLength);
    }

    checkIfSpambot(message,msg) {
        if (!(msg.userInfo.isSubscriber || msg.userInfo.isVip)) {
            if (followBotFilter.exec(message)) {
                this.reason = `Auto detect [botSpam] | Banned for: ${message}`;
                return [true, this.getActionType(), this.reason];
            } else if (followBotFilter2.exec(message)) {
                this.reason = `Auto detect [botSpam] | Banned for: ${message}`;
                return [true, this.getActionType(), this.reason];
            } else if (linkFilter1.exec(message)) {
                this.reason = `Auto detected [SuspiciousLink] | Banned for: ${message}`;
                return [true, this.getActionType(), this.reason];
            } else if (linkFilter2.exec(message)) {
                this.reason = `Auto detected [SuspiciousLink] | Banned for: ${message}`;
                return [true, this.getActionType(), this.reason];
            } else if (linkFilter3.exec(message)) {
                this.reason = `Auto detected [SuspiciousLink] | Banned for: ${message}`;
                return [true, this.getActionType(), this.reason];
            }
        }
    }
}
module.exports.Spambot = Spambot;