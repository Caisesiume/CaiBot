const Moderation = require("./moderation/Moderation");
const ModActions = require("./moderation/ModActions");
const CommandsController = require("./commands/CommandsController");
const {Queue} = require("../utils");

class TwitchChannel{
    channel_key;
    channel_name;
    messages;
    mods = [];
    moderationSettings;
    commands;
    recentTimeouts = [];
    msgLog = {};

    constructor(channel_key, channel_name, messages, mods, moderationSettings, hasCommands) {
        this.channel_key = channel_key;
        this.channel_name = channel_name;
        this.messages = messages;
        this.mods = mods;
        this.moderationSettings = new Moderation.Moderation(moderationSettings);
        this.commands = new CommandsController.CommandsController(hasCommands);
        this.recentTimeouts = [];
        this.msgLog = new Queue.Queue();
    }

    getModeration() {
        return this.moderationSettings;
    }

    getCommandSettings(){
        return this.commands;
    }

    getLog(){
        return this.msgLog;
    }

    /**
     * Adds recently timed out users to a "probation" list.
     * After (timeoutLength * 15) * 1000 ms the user is removed from the list.
     * @param username lowercase username
     * @param timeoutLength the timeoutLength of the violated filter in seconds.
     */
    async addToTimeoutList(username, timeoutLength) {
        this.recentTimeouts.push(username.toLowerCase());
        setTimeout(this.removeFromTimeOutList,timeoutLength*15*1000,username.toLowerCase())
    }

    /**
     * Removes a user from the list of the recently timed out users in the channel.
     * @param user the user to be removed
     */
    async removeFromTimeOutList(user) {
        console.log(user)
        console.log(this.recentTimeouts)
        let indexOfUser = this.recentTimeouts.indexOf(user);
        if (indexOfUser > -1) {
            this.recentTimeouts.splice(indexOfUser, 1);
        }
    }

    /**
     * Get the amount of time a user should be timed out for.
     * @param user the user to be timed out
     * @param timeoutLength the initial timeout charge from one moderation filter.
     * @returns {number|*} the final timeout length a user will get.
     */
    async setNewTimeout(user,timeoutLength) {
        if (this.recentTimeouts.includes(user.toLowerCase())) {
            let timeoutLengthMultiply = timeoutLength*100;
            if (timeoutLengthMultiply < 86401) {
                return timeoutLengthMultiply;
            } else {
                return 86400; //24H
            }
        } else {
            await this.addToTimeoutList(user,timeoutLength);
            return timeoutLength;
        }
    }


    /**
     * Adds elements to the channels temp message log. This is used to keep a log of the recent messages.
     *
     * @param element needs be following: {message:user} where the message is the key.
     * @param msg is the meta data of the message, used to check if the message is from a moderator or not.
     */
    async addToTempLog(msgToAdd, sendingUser, msg) {
        //if current size < max size
        if (!msg.userInfo.isMod) {
            let element = {
                "message": msgToAdd,
                "sender": sendingUser
            }
            if (this.msgLog.length() < this.msgLog.getSize()) {
                await this.msgLog.enqueue(element)
            } else {
                await this.msgLog.dequeue();
                await this.addToTempLog(msgToAdd,sendingUser,msg);
            }
        }
    }

    hasModeration() {
        return this.moderationSettings.isActive();
    }
}
module.exports.TwitchChannel = TwitchChannel;