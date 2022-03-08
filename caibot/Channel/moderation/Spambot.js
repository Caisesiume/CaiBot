const {ModerationFilter} = require("./ModerationFilter");
const followBotFilter = /\b(b *i *g *f *o *l *l *o *w *s *(\.|\,) *c *o *m)+/gmi;
const followBotFilter2 =  /\b(y *o *u *r *f *o *l *l *o *w *z *(\.|\,) *c *o *m)+/gmi;
const followBotFilter3 =  /\b(v *i *e *w *e *r *s *(\.|\,) *s *h *o *p)+/gmi;
const linkFilter1 = /\b(c*u*t*t(\.|\,) *(l*y*\/))+/gmi;
const linkFilter2 = /\b(b*i*t(\.|\,)+([a-z]+)+\/)+/gmi;
const linkFilter3 = /\b((t|o *w)+(\.|\,) *(ly|cc|co)\/)+/gmi;
const linkFilter4 = /\b(t *i *n *y *(u* *r *l)? *(\.|\,) *(c *c|l *y|c *o *m)\/)+/gmi;
const linkFilter5 = /\b(s *h *o *r *t *u* *r *l *(\.|\,) *a *t\/)+/gmi;
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
            } else if (followBotFilter3.exec(message)) {
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
            } else if (linkFilter4.exec(message)) {
                this.reason = `Auto detected [SuspiciousLink] | Banned for: ${message}`;
                return [true, this.getActionType(), this.reason];
            } else if (linkFilter5.exec(message)) {
                this.reason = `Auto detected [SuspiciousLink] | Banned for: ${message}`;
                return [true, this.getActionType(), this.reason];
            }
        }
    }
}
module.exports.Spambot = Spambot;