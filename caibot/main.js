const Auth = require('./Auth');
const ConnectToChannel = require('./ChannelConnection');
const ChannelPointsListeners = require('./ChannelPointRedemptions');

const PATH_CLIENT = '../client.json';
const PATH_TOKENS = '../tokens.json';

(async () => {
    exports.chatClient = await Auth.auth(PATH_CLIENT, PATH_TOKENS);
    await onBotStartUp();
    async function onBotStartUp() {
        /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
         * 20 authenticate attempts per 10 seconds per user (200 for verified bots)  *
         * 20 join attempts per 10 seconds per user (2000 for verified bots)         *
         * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
        const channelChunkSize = 5; //amount of channels to join every joinInterval.
        const joinInterval = 10000; //10s
        await ConnectToChannel.connectToChannels(channelChunkSize,joinInterval);
        await startListeners();
    }
    async function startListeners() {
        await ChannelPointsListeners.channelPointsTracker();
        //await Moderation();
    }
})();