const BotUtil = require('./bot-utils'); //help functions mostly to avoid exceptions.
const FileHandler = require('./io-handler');
const Auth = require('./Auth');
const fs = require('fs-extra');
const ChannelPointsListeners = require('./ChannelPointRedemptions');

const PATH_CLIENT = '../client.json';
const PATH_TOKENS = '../tokens.json';
const PATH_CHANNELS = '../channels.json';
let botChannels = {};
let channelChunks = [];
let currentlyRunningChannels = [];
(async () => {

    const chatClient = await Auth.auth(PATH_CLIENT,PATH_TOKENS);
    botChannels = JSON.parse(await fs.readFile(PATH_CHANNELS,'UTF-8'));
    currentlyRunningChannels = FileHandler.getOperatingChannels(botChannels.joined_channels); //saves all channels the bot is in
    setInterval(FileHandler.writeUpdatedChannels,20000,PATH_CHANNELS,botChannels); //auto save to disk

    console.log("Connecting to Twitch");
    await chatClient.connect();
    console.log("Connected to Twitch");
    await chatClient.waitForRegistration();
    await onBotStartUp(chatClient);

    /** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * 20 authenticate attempts per 10 seconds per user (200 for verified bots) *
     * 20 join attempts per 10 seconds per user (2000 for verified bots)        *
     ** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    async function onBotStartUp() {
        const channelChunkSize = 5; //amount of channels to join every joinInterval.
        const joinInterval = 10000; //10s
        channelChunks = await BotUtil.channelArraySplitter(channelChunkSize,currentlyRunningChannels);
        await channelChunkProvider(channelChunks,joinInterval)
        await getModeratorsForAll();
        await ChannelPointsListeners.channelPointsTracker(chatClient);

        setTimeout(joinNewChannel,joinInterval,"#test"); //TODO remove
        //await updateChannelJSON(); updates the json each time the bot starts.
    }

    async function channelChunkProvider(channelChunks, joinInterval) {
        for (let x=0 ; x < channelChunks.length; x++) {
            let interval = joinInterval * x;
            setTimeout(joinChannels,interval, channelChunks[x]);
        }
    }

    async function joinChannels(channelsToBeJoined) {
        console.log(currentlyRunningChannels)
        const channelKeys = Object.keys(channelsToBeJoined);
        for (let channel of channelKeys) {
            if (BotUtil.isValidKey(channelsToBeJoined[channel])) {
                console.log("Joining channel:", channelsToBeJoined[channel]);
                await chatClient.join(channelsToBeJoined[channel]);
            } else {
                console.log("Joining channel failed: " + channelsToBeJoined[channel] + " ![key]");
            }
        }
    }

    async function getModeratorsForAll() {
        for (const channelsToJoinElement of botChannels.joined_channels) {
            console.log("Getting Mod List for ", channelsToJoinElement.channel_key);
            channelsToJoinElement.mods = await chatClient.getMods(channelsToJoinElement.channel_key);
        }
    }

    function addOperatingChannels(channelKey) {
        if (!currentlyRunningChannels.includes(channelKey)) {
            currentlyRunningChannels.push(channelKey);
        }
    }

    async function joinNewChannel(channelKey) {
        if (BotUtil.isValidKey(channelKey)) {
            let channel_key = channelKey.toLowerCase();
            if (!(currentlyRunningChannels.includes(channel_key))) {
                console.log("Joining channel:", channel_key);
                setTimeout(async function joinChannel() { await chatClient.join(channel_key); }, 1000);
                addOperatingChannels(channel_key); //adds the channel to track it as a channel the bot is operating in
                console.log("Getting Mod List for ", channel_key);
                let newChannelObject = {
                    "channel_key": channel_key,
                    "channel_name": channel_key.split('#').join(''),
                    "messages": 0,
                    "mods": await chatClient.getMods(channel_key)
                }
                botChannels.joined_channels.push(newChannelObject); //adds the newly joined channel to the saved json structure
            } else {
                console.log("Joining channel failed: " + channelKey + ", Already joined");
            }
        } else {
            console.log("Joining channel: " + channelKey + ", Invalid key");
        }
    }
})();