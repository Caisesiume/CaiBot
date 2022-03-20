const {ModerationFilter} = require("./ModerationFilter");
const discordLink = /(d *i *s *c *o *r *d *(\.|\,) *g *g\/.+)+/gmi;
const nsfwLink = /((phub|pornhub|xnxx|xvideos|xHamster|YouPorn|HClips|Porn|TnaFlix|Tube8|spankbang|PornHD|Jasmin|livejasmin|imlive|brazzers|fapster|Chaturbate)(\.|\,) *com(\/.+)*)/gmi;
class LinkFilter extends ModerationFilter{
   constructor(filterType,description,enabled, ban, timeoutLength) {
       super(filterType,description,enabled, ban, timeoutLength);
   }

    checkIfMatch(message) {
        if (discordLink.exec(message)) {
            let reason = ` Auto detect [Link] Don't post discord invites in chat... | ${message}`
            return [true, this.getActionType(), reason];
        } else if (nsfwLink.exec(message)) {
            let reason = ` Auto detect [Link] Don't link nsfw content in Twitch chat. | ${message}`
            return [true, this.getActionType(), reason];
        }
    }
}
module.exports.LinkFilter = LinkFilter;