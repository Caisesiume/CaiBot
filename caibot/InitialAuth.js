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

    async function onBotStartUp() {
        const channelChunkSize = 5;
        const joinInterval = 10000;
        const numberOfChannels = botChannels.joined_channels.length;
        /** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
         * 20 authenticate attempts per 10 seconds per user (200 for verified bots) *
         * 20 join attempts per 10 seconds per user (2000 for verified bots)        *
         ** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
        await channelArraySplitter(channelChunkSize);
        await channelChunkProvider(channelChunks,joinInterval)
        await getChannelModerators();
        setTimeout(joinNewChannel, (numberOfChannels/5)*joinInterval,'#ratirl') //This a test of joinNewChannel
        //await updateChannelJSON();
    }


    async function channelArraySplitter(channelChunkSize) {
        const listOfChannelChunks = [];
        let chunkSize = channelChunkSize;
        let channelListLength = botChannels.joined_channels.length;
        let channelsJoined = 0;
        let latestArrayBreak = 0;
        for (let i = 1; i< channelListLength; i++) {
            if (i % channelChunkSize === 0) {
                let splitArrayOfObjects = botChannels.joined_channels.slice(latestArrayBreak,i);
                let chunkArray = [];
                let j = 0;
                while (channelChunkSize !== j) {
                    let splitKey = splitArrayOfObjects[j].channel_key;
                    chunkArray.push(splitKey);
                    j++;
                }
                channelsJoined += chunkSize;
                latestArrayBreak += chunkSize;
                listOfChannelChunks.push(chunkArray);
            }
            if (channelListLength - channelsJoined <= chunkSize) {
                let remainingCount = channelListLength - channelsJoined;
                let splitEndOfArray = botChannels.joined_channels.slice(latestArrayBreak,channelListLength);
                let chunkArray = [];
                let k = 0;
                while (k < remainingCount) {
                    let splitKey2 = splitEndOfArray[k].channel_key;
                    chunkArray.push(splitKey2);
                    i = channelListLength;
                    k++;
                }
                listOfChannelChunks.push(chunkArray);
            }
        }
        channelChunks = listOfChannelChunks;
    }

    async function channelChunkProvider(channelChunks, joinInterval) {
        for (let x=0 ; x < channelChunks.length; x++) {
            let interval = joinInterval * x;
            setTimeout(joinChannels,interval, channelChunks[x]);
        }
    }

    async function joinChannels(channelsToBeJoined) {
        for (let channel in channelsToBeJoined) {
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