const Moderation = require("./moderation/Moderation");
const ModActions = require("./moderation/ModActions");
const CommandsController = require("./interaction/commands/CommandsController");
const Reaction = require("./interaction/reaction/ReactionController");
const {Queue} = require("../utils");

class TwitchChannel{
    channel_key;
    channel_name;
    messages;
    mods = [];
    moderationSettings;
    commands;
    reactions;
    recentTimeouts = [];
    msgLog = {};
    socials;

    constructor(channel_key, channel_name, messages, socials, mods, moderationSettings, hasCommands, hasReactions) {
        this.channel_key = channel_key;
        this.channel_name = channel_name;
        this.messages = messages;
        this.socials = checkSocials(socials);
        this.mods = mods;
        this.moderationSettings = new Moderation.Moderation(moderationSettings);
        this.commands = new CommandsController.CommandsController(hasCommands);
        this.reactions = new Reaction.ReactionController(hasReactions)
        this.recentTimeouts = [];
        this.msgLog = new Queue.Queue();
    }

    getModeration() {
        return this.moderationSettings;
    }

    getCommandSettings(){
        return this.commands;
    }

    getReactionSettings(){
        return this.reactions;
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
        try{
            console.log(user)
            console.log(this.recentTimeouts)
            let indexOfUser = this.recentTimeouts.findIndex(user);
            if (indexOfUser > -1) {
                this.recentTimeouts.splice(indexOfUser, 1);
            }
        } catch(err) {
            console.log(err);
        }
    }

    /**
     * Get the amount of time a user should be timed out for.
     * @param user the user to be timed out
     * @param timeoutLength the initial timeout charge from one moderation filter.
     * @returns {number|*} the final timeout length a user will get.
     */
    async setNewTimeout(user,timeoutLength) {
        try {
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
        } catch (err) {
            console.log(err);
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
            if (this.getLog().length() < this.msgLog.getSize()) {
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

    /**
     * Function checks the json structure provided as param for duplicated social handles
     * and provides all socials in an array in order to let the correct data be used during runtime of the bot.
     * 
     * @param {Array} socials 
     * @returns JSON object containing the channels saved social handles on different platforms.
     */
    checkSocials(socials) {
        const socialArray = [];
        for (let objectKey in socials) { // for every index in socials (provided array)
            let currentObj = socials[objectKey]; // saves the element (needs to be a json object) of this iteration
            let keyName = Object.keys(currentObj); // gets the key(s) of the object and returns an array with the key(s)
            if(keyName.length === 1) { // Only care if there is just one key in the object, if there is more than 1 something is very wrong. 
                let objKey = Object.keys(currentObj)[0]; // Retrive the name of the key saved at position 0 in the array.
                let objValue = Object.values(currentObj)[0]; // Retrive the name of the value saved at position 0 in the array.
                let socialObj = { [objKey]:objValue }; // Recreate the object to ensure the format required. (Memory issue?) Luckily this isn't C...
                socialArray.push(socialObj); // Add the newly created object to the array of socials.
            }
        }
        return socialArray;
    }
}
module.exports.TwitchChannel = TwitchChannel;