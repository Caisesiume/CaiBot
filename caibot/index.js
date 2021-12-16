const ConnectToChannel = require('./ChannelConnection');
const ChannelPointsListeners = require('./Channel/channelpoints/ChannelPointRedemptions');
const Auth = require("./Auth/Auth");

(async () => {
    await onBotStartUp();
    async function onBotStartUp() {
        const chatClient = await Auth.auth();
        global.BOT_START_DATE = new Date();
        /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
         * 20 authenticate attempts per 10 seconds per user (200 for verified bots)  *
         * 20 join attempts per 10 seconds per user (2000 for verified bots)         *
         * https://dev.twitch.tv/docs/irc/guide                                      *
         * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
        const CHUNK_SIZE = 5; //amount of channels to join every joinInterval.
        const JOIN_INTERVAL = 10000; //10s
        await ConnectToChannel.connectToChannels(CHUNK_SIZE,JOIN_INTERVAL,chatClient);
        await ChannelPointsListeners.channelPointsTracker(chatClient);
    }
})();
