class LookAhead {
    constructor(chatClient,actionType, channel ,msg) {
        this.chatClient = chatClient;
        this.actionType = actionType;
        this.actionChannel = channel;
        this.msg = msg;
        this.pattern = `\\b${this.msg}\\b`
        this.regex = new RegExp(this.pattern,'gmi')
        this.active = true;
    }

    deactivate() {
        this.active = false;
        console.log("nuke stopped")
    }

    check() {
        this.chatClient.onPrivmsg(async(channel,user,message,msg) => {
            if ((this.actionChannel === channel) && this.active) {
                if (message.toLowerCase().match(this.regex)) {
                    console.log(`${user} nuked! | msg: ${message}`)
                    this.action(user);
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