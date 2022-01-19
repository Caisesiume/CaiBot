const fs = require('fs-extra');
const FileHandler = require('./utils/io-handler');
const Utils = require('./utils');
const TwitchChannel = require('./Channel/TwitchChannel');
const ModActions = require("./Channel/moderation/ModActions");
const Commands = require("./Channel/interaction/commands/CommandListener");
const GlobalCommands = require("./Channel/interaction/global/GlobalCommands");
const Reaction = require('./Channel/interaction/reaction/SubReactions');

const PATH_CHANNELS = './Channel/channels.json';
let botChannels = {};
let channelChunks = [];
let currentlyRunningChannels = [];
let channelObjects = [];
let joinQueue = new Utils.Queue.Queue();

module.exports.connectToChannels = async function (channelChunkSize, joinInterval,chatClient) {
    botChannels = JSON.parse(await fs.readFile(PATH_CHANNELS,'UTF-8'));
    currentlyRunningChannels = FileHandler.getOperatingChannels(botChannels.joined_channels); //saves all channels the bot is in
    botChannels.channel_count = currentlyRunningChannels.length;
    setInterval(prepareUpdate, 3000, PATH_CHANNELS, botChannels, channelObjects); //auto save to disk every 60s

    function prepareUpdate(PATH, botChannels, channelObjects) {
        botChannels.joined_channels = channelObjects
        //console.log(botChannels.joined_channels[1].reactions);
        FileHandler.writeUpdatedChannels(PATH_CHANNELS,botChannels)
    }

    console.log(Utils.TimeHandler.getDateHHMMSS()+ " | Connecting to Twitch");
    await chatClient.connect();
    console.log(Utils.TimeHandler.getDateHHMMSS() + " | Connected to Twitch");
    await chatClient.waitForRegistration();

    channelChunks = await Utils.ArraySplitter.ArraySplitter(channelChunkSize, currentlyRunningChannels);
    await channelChunkProvider(channelChunks, joinInterval)
    await getModeratorsForAll();

    async function channelChunkProvider(channelChunks, joinInterval) {
        for (let x = 0; x < channelChunks.length; x++) {
            let interval = joinInterval * x;
            setTimeout(joinChannels, interval, channelChunks[x]);
        }
    }

    async function joinChannels(channelsToBeJoined) {
        console.log(currentlyRunningChannels)
        const channelKeys = Object.keys(channelsToBeJoined);
        for (let channel of channelKeys) {
            if (isValidKey(channelsToBeJoined[channel])) {
                console.log(Utils.TimeHandler.getDateHHMMSS()+ " | Joining channel:", channelsToBeJoined[channel]);
                await chatClient.join(channelsToBeJoined[channel]);
                let newChannelObj = await reCreateChannelObject(botChannels.joined_channels[channel]); //Recreates objects from JSON
                await newChannelObj.moderationSettings.setFilters(botChannels.joined_channels[channel].moderationSettings)
                await newChannelObj.commands.setCommands(botChannels.joined_channels[channel].commands)
                await newChannelObj.reactions.setReaction(botChannels.joined_channels[channel].reactions)
                await startListener(newChannelObj);
            } else {
                console.log(Utils.TimeHandler.getDateHHMMSS() + " | Joining channel failed: " + channelsToBeJoined[channel] + " ![key]");
            }
        }
        await GlobalCommands.listenGlobal(channelObjects,chatClient);
    }

    async function reCreateChannelObject(jsonStructure) {
        //console.log(jsonStructure);
        return new TwitchChannel.TwitchChannel(jsonStructure.channel_key, jsonStructure.channel_name,
            jsonStructure.messages, jsonStructure.mods, jsonStructure.moderationSettings.enabled,jsonStructure.commands.enabled,jsonStructure.reactions.enabled);
    }

    async function getModeratorsForAll() {
        for (const channelsToJoinElement of botChannels.joined_channels) {
            console.log(Utils.TimeHandler.getDateHHMMSS() + " | Getting Mod List for: ", channelsToJoinElement.channel_key);
            channelsToJoinElement.mods = await chatClient.getMods(channelsToJoinElement.channel_key);
        }
    }

    function addOperatingChannels(channelKey) {
        if (!currentlyRunningChannels.includes(channelKey)) {
            currentlyRunningChannels.push(channelKey);
        }
    }

    async function addToChannelObjList(channelObject) {
        channelObjects.push(channelObject);
    }

    chatClient.onPrivmsg(async (channel, user, message, msg) => {
        if (message === '!joinme') {
            await joinNewChannel(`#${user.toLowerCase()}`);
        }
    });

    await setInterval(async function joinChannel() {
        if (!joinQueue.isEmpty()) { //joins the channel 1st in queue each 5s
            let channel_key = joinQueue.getFront();
            await chatClient.join(channel_key);
            console.log(Utils.TimeHandler.getDateHHMMSS() + " | Joining channel:", channel_key);
            addOperatingChannels(channel_key); //adds the channel to track it as a channel the bot is operating in
            await joinQueue.dequeue();
            console.log(Utils.TimeHandler.getDateHHMMSS() + " | Getting Mod List for: ", channel_key);
            let mods = await chatClient.getMods(channel_key);
            let newChannelObject = new TwitchChannel.TwitchChannel(channel_key,channel_key.split('#').join(''),0,mods,true,true)
            botChannels.joined_channels.push(newChannelObject); //adds the newly joined channel to the saved json structure
            botChannels.channel_count++;
        }
    }, 5000);

    async function startListener(channelObject) {
        await ModActions.listen(channelObject,chatClient);
        await Commands.listen(channelObject,chatClient);
        await Reaction.listenToSubs(channelObject,chatClient);
        await addToChannelObjList(channelObject);
    }
};

 async function joinNewChannel(channelKey) {
    if (isValidKey(channelKey)) {
        let channel_key = channelKey.toLowerCase();
        if (!(currentlyRunningChannels.includes(channel_key))) {
            joinQueue.enqueue(channel_key);
        } else {
            console.log(Utils.TimeHandler.getDateHHMMSS() + " | Joining channel failed: " + channelKey + ", Already joined");
        }
    } else {
        console.log(Utils.TimeHandler.getDateHHMMSS() + " | Joining channel: " + channelKey + ", Invalid key");
    }
}

/**
 * Checks whether a channel key is valid or not.
 * @param channelKey - key (string) that needs to be validated.
 * @returns true if key is valid, otherwise return false.
 */
isValidKey = function (channelKey) {
    return !!channelKey.startsWith('#');
}