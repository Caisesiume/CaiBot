const Utils = require("../../../utils/TimeHandler");

class LookAhead {
    constructor(chatClient,actionType, channel ,msg) {
        this.chatClient = chatClient;
        this.actionType = actionType;
        this.actionChannel = channel;
        this.msg = msg;
        this.pattern = `${this.msg}\\b`
        this.regex = new RegExp(this.pattern,'gmi')
        this.active = true;
    }

    deactivate() {
        let currentTime = Utils.getDateHHMMSS();
        this.active = false;
        console.log(`${this.actionChannel} | ${currentTime} | Nuke for ${this.msg} ended!`)
    }

    check() {
        this.chatClient.onPrivmsg(async(channel,user,message,msg) => {
            if ((this.actionChannel === channel) && this.active) {
                if (!msg.userInfo.isMod){
                    if (message.toLowerCase().match(this.regex)) {
                        let currentTime = Utils.getDateHHMMSS();
                        console.log(`${channel} | ${currentTime} | ${user} nuked! | msg: ${message}`)
                        this.action(user);
                    }
                }
            }
        });
    }

    action(user) {
        let isNum = /^\d+$/.test(this.actionType);
        if (isNum) {
            this.chatClient.timeout(this.actionChannel,user,this.actionType,`nuked by moderator | nuked phrase: ${this.msg}`)
        } else if (this.actionType === 'ban') {
            this.chatClient.ban(this.actionChannel,user,`nuked by moderator | nuked phrase: ${this.msg}`)
        }
    }
}
module.exports.LookAhead = LookAhead;