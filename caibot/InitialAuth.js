const BotUtil = require('./bot-utils'); //help functions mostly to avoid exceptions.
const TwitchClient = require('twitch').default;
const ChatClient = require('twitch-chat-client').default;
const fs = require('fs-extra');
let botChannels = {};
let channelChunks = [];
let currentlyRunningChannels = [];

(async () => {
    const clientData = JSON.parse(await fs.readFile('../client.json', 'UTF-8'));
    const tokenData = JSON.parse(await fs.readFile('../tokens.json', 'UTF-8'));
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
            await fs.writeFile('../tokens.json', JSON.stringify(newTokenData, null, 4), 'UTF-8')
        }
    });
    const chatClient = await ChatClient.forTwitchClient(twitchClient);
    botChannels = JSON.parse(await fs.readFile('../channels.json','UTF-8'));

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
        const numberOfChannels = botChannels.joined_channels.length;
        channelChunks = await BotUtil.channelArraySplitter(channelChunkSize,botChannels);
        await channelChunkProvider(channelChunks,joinInterval)
        await getChannelModerators();
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
            if (BotUtil.isValidKey(channelsToBeJoined[channel])) {
                console.log("Joining channel:", channelsToBeJoined[channel]);
                await chatClient.join(channelsToBeJoined[channel]);
                currentlyRunningChannels.push(channelsToBeJoined[channel])
            } else {
                console.log("Joining channel failed: " + channelsToBeJoined[channel] + " ![key]");
            }
        }
    }

    async function getChannelModerators() {
        for (const channelsToJoinElement of botChannels.joined_channels) {
            console.log("Getting Mod List for ", channelsToJoinElement.channel_key);
            let moderatorList = await chatClient.getMods(channelsToJoinElement.channel_key)
            channelsToJoinElement.mods.push(moderatorList);
        }
    }

    async function joinNewChannel(channelKey) {
        if (!currentlyRunningChannels.includes(channelKey) && BotUtil.isValidKey(channelKey)) {
            console.log("Joining channel:", channelKey);
            await chatClient.join(channelKey);
            currentlyRunningChannels.push(channelKey);
        } else {
            console.log("Joining channel: " + channelKey + " failed.");
        }
    }

})();