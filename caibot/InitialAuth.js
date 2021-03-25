const BotUtil = require('./bot-utils'); //help functions mostly to avoid exceptions.
const FileHandler = require('./io-handler');
const TwitchClient = require('twitch').default;
const ChatClient = require('twitch-chat-client').default;
const fs = require('fs-extra');

const PATH_CLIENT = '../client.json';
const PATH_TOKENS = '../tokens.json';
const PATH_CHANNELS = '../channels.json';
let botChannels = {};
let channelChunks = [];
let currentlyRunningChannels = [];
//TODO add join queue



(async () => {
    const clientData = JSON.parse(await fs.readFile(PATH_CLIENT, 'UTF-8'));
    const tokenData = JSON.parse(await fs.readFile(PATH_TOKENS, 'UTF-8'));
    const twitchClient = await TwitchClient.withCredentials(clientData.clientId, tokenData.accessToken, undefined, {
        clientSecret: clientData.clientSecret,
        refreshToken: tokenData.refreshToken,
        expiry: tokenData.expiryTimestamp === null ? null : new Date(tokenData.expiryTimestamp),
        onRefresh: async ({ accessToken, refreshToken, expiryDate }) => {
            console.log("Refreshing Access Token");
            const newTokenData = {
                accessToken,
                refreshToken,
                expiryTimestamp: expiryDate === null ? null : expiryDate.getTime()
            };
            await fs.writeFile(PATH_TOKENS, JSON.stringify(newTokenData, null, 4), 'UTF-8')
        }
    });
    const chatClient = await ChatClient.forTwitchClient(twitchClient);
    botChannels = JSON.parse(await fs.readFile(PATH_CHANNELS,'UTF-8'));
    setInterval(FileHandler.writeUpdatedChannels,30000,'../channels.json',botChannels); //local auto save

    console.log("Connecting to Twitch");
    await chatClient.connect();
    console.log("Connected to Twitch");
    await chatClient.waitForRegistration();
    await onBotStartUp();

    /** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * 20 authenticate attempts per 10 seconds per user (200 for verified bots) *
     * 20 join attempts per 10 seconds per user (2000 for verified bots)        *
     ** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    async function onBotStartUp() {
        const channelChunkSize = 5; //amount of channels to join every joinInterval.
        const joinInterval = 10000; //10s
        channelChunks = await BotUtil.channelArraySplitter(channelChunkSize,botChannels);
        await channelChunkProvider(channelChunks,joinInterval)
        await getModeratorsForAll();
        //setTimeout(joinNewChannel,joinInterval,"#test");
        //await updateChannelJSON(); updates the json each time the bot starts.
    }

    async function channelChunkProvider(channelChunks, joinInterval) {
        for (let x=0 ; x < channelChunks.length; x++) {
            let interval = joinInterval * x;
            setTimeout(joinChannels,interval, channelChunks[x]);
        }
    }

    async function joinChannels(channelsToBeJoined) {
        const channelKeys = Object.keys(channelsToBeJoined);
        for (let channel of channelKeys) {
            if (BotUtil.isValidKey(channelsToBeJoined[channel]) && !(currentlyRunningChannels.includes(channelsToBeJoined[channel]))) {
                console.log("Joining channel:", channelsToBeJoined[channel]);
                await chatClient.join(channelsToBeJoined[channel]);
                addOperatingChannels(channelsToBeJoined[channel].toLowerCase());
            } else {
                console.log("Joining channel failed: " + channelsToBeJoined[channel] + " ![key]/already joined");
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
        if (!(currentlyRunningChannels.includes(channelKey)) && BotUtil.isValidKey(channelKey)) {
            let channel_key = channelKey.toLowerCase();
            console.log("Joining channel:", channel_key);
            await chatClient.join(channel_key);
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
            console.log("Joining channel: " + channelKey + " failed.");
        }
    }
})();