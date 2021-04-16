const ConnectToChannel = require('./ChannelConnection');
const ChannelPointsListeners = require('./ChannelPointRedemptions');
const Auth = require("./Auth");

(async () => {
    await onBotStartUp();
    async function onBotStartUp() {
        const chatClient = await Auth.auth();
        /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
         * 20 authenticate attempts per 10 seconds per user (200 for verified bots)  *
         * 20 join attempts per 10 seconds per user (2000 for verified bots)         *
         * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
        const channelChunkSize = 5; //amount of channels to join every joinInterval.
        const joinInterval = 10000; //10s
        await ConnectToChannel.connectToChannels(channelChunkSize,joinInterval,chatClient);
        await ChannelPointsListeners.channelPointsTracker(chatClient);

    }
})();