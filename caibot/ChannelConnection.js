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


    /**
     * Function used to prepare save to file. 
     * It overwrite the previous saved json structure with the newest object data.
     * Then we call the file writer module providing two arguments.
     * @argument {PATH} PATH | Required when calling the file writer module, see param definition.
     * @argument {botChannels} botChannels | Required when calling the file writer module. This arg contains the json structure with the latest data.
     * 
     * @param {FILE_PATH} PATH This will be the path of the json file the system will write to. 
     * @param {*} botChannels The json structure we use for the full system.
     * @param {*} channelObjects Array of all channel objects
     */
    function prepareUpdate(PATH, botChannels, channelObjects) {
        botChannels.joined_channels = channelObjects
        FileHandler.writeUpdatedChannels(PATH,botChannels)
    }

    console.log(Utils.TimeHandler.getDateHHMMSS()+ " | Connecting to Twitch");
    await chatClient.connect();
    console.log(Utils.TimeHandler.getDateHHMMSS() + " | Connected to Twitch");
    await chatClient.waitForRegistration();

    channelChunks = await Utils.ArraySplitter.ArraySplitter(channelChunkSize, currentlyRunningChannels);
    await channelChunkProvider(channelChunks, joinInterval)
    await getModeratorsForAll();

    /**
     * This function is used to easier comply with Twitch rate limits.
     * The bot can only join X amount of channels in Y amount of time.
     * Therefore this function fills the functionality to limit the JOIN/s rate.
     * For each iteration of the loop, we join the channels in array X in the two-dimensional array.
     * 
     * @param {Array} channelChunks needs to be a two-dimensional array. Eg. [["#channel1, "#channel2"], ["#channel3", "#channel4"]]
     * @param {Number} joinInterval 
     */
    async function channelChunkProvider(channelChunks, joinInterval) {
        for (let x = 0; x < channelChunks.length; x++) {
            let interval = joinInterval * x;
            setTimeout(joinChannels, interval, channelChunks[x]);
        }
    }


    /**
     * Loops through the param array to join each channel in the array.
     * Checks if element X is valid before attempting to join the channel.
     * A valid channel_key must look like this: #channel_key
     * 
     * @function channelChunkProvider() Use this fucntionn to provide this function with arrays of reasonable length.
     * 
     * @param {Array} channelsToBeJoined Needs to be an array containing channel keys
     */
    async function joinChannels(channelsToBeJoined) {
        console.log(currentlyRunningChannels)
        const channelKeys = Object.keys(channelsToBeJoined);
        for (let channel of channelKeys) { // Loops through all channel keys, where channel is the index in the array.
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


    /**
     * Recreates objects on start up. Takes the last saved json structure as input and creates objects
     * from the data. When this is done, actions can be performed on the objects.
     * 
     * @param {JSON} jsonStructure needs to be of the same json structure as the system gives as output. 
     * @returns Returns TwitchChannel Object, this object contains everything related to each channel.
     */
    async function reCreateChannelObject(jsonStructure) {
        //console.log(jsonStructure);
        return new TwitchChannel.TwitchChannel(jsonStructure.channel_key, jsonStructure.channel_name,
            jsonStructure.messages, jsonStructure.mods, jsonStructure.moderationSettings.enabled,jsonStructure.commands.enabled,jsonStructure.reactions.enabled);
    }

    //Updates the list of moderators for all channels.
    async function getModeratorsForAll() {
        for (const channelsToJoinElement of botChannels.joined_channels) {
            console.log(Utils.TimeHandler.getDateHHMMSS() + " | Getting Mod List for: ", channelsToJoinElement.channel_key);
            channelsToJoinElement.mods = await chatClient.getMods(channelsToJoinElement.channel_key);
        }
    }

    /**
     * Function to add a new channel to the list of channels the bot is operating in.
     * It checks first if the bot is already joined, if not it adds the channel to the join queue.
     * 
     * @param {String} channelKey is the key to the channel the bot is about to join. E.g: "#caisesiume"
     */
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


    /**
     * Basically a loop with delay. This runs every 5 seconds to check if the join queue has any new entries.
     * If there are channels to join, we join the one at front in the queue first.
     * Before we send the join request, we generate the json structure and the object for the channel.
     * At last the added channel is added to the currently monitored channels. 
     */
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

/**
 * The function is used when added new channels to the bot, channels that do not have any records in the system from before.
 * If the key is valid and the bot is not already operating in this channel, the channel will be added to the join queue.
 * 
 * @param {String} channelKey is the key to the channel the bot will attempt to join. E.g "#caisesiume"
 */
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