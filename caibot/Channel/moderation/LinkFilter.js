const {ModerationFilter} = require("./ModerationFilter");
const discordLink = /(d *i *s *c *o *r *d *(\.|\,) *g *g\/(?<handle>.+))+/gmi;
const nsfwLink = /((phub|pornhub|xnxx|xvideos|xHamster|YouPorn|HClips|Porn|TnaFlix|Tube8|spankbang|PornHD|Jasmin|livejasmin|imlive|brazzers|fapster|Chaturbate)(\.|\,) *com(\/.+)*)/gmi;
class LinkFilter extends ModerationFilter{
   constructor(filterType,description,enabled, ban, timeoutLength) {
       super(filterType,description,enabled, ban, timeoutLength);
   }

    checkIfMatch(message, socialArray) {
        let isDiscordLink = discordLink.exec(string)
        if (isDiscordLink) {
            if (!this.checkIfAllowedHandle(isDiscordLink,socialArray)) {
                let reason = ` Auto detect [Link] Don't post discord invites in chat... | ${message}`
                return [true, this.getActionType(), reason];
            }
        } else if (nsfwLink.exec(message)) {
            let reason = ` Auto detect [Link] Don't link nsfw content in Twitch chat. | ${message}`
            return [true, this.getActionType(), reason];
        }
    }

    checkIfAllowedHandle(isDiscordLink, socialArray) {
        let handleTag = isDiscordLink.groups['handle'];
        let allowedHandle;
        for (let objectKey in socialArray) {
            let currentObj = socialArray[objectKey]
            let keyName = Object.keys(currentObj)[0];
            if(keyName == 'discord') {
                let objValue = Object.values(currentObj)[0];
                allowedHandle = objValue;
                break;
            }
        }
        if (allowedHandle === undefined) { // If there is no specified discord link saved in socials, return false.
            return false;
        }
        return handleTag.toLowerCase() === allowedHandle.toLowerCase(); // true if the social handle in the message is the same as the allowed one.
    }
}
module.exports.LinkFilter = LinkFilter;