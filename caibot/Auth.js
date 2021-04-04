const TwitchClient = require('twitch').default;
const ChatClient = require('twitch-chat-client').default;
const fs = require('fs-extra');


/**
 * Keeps your bot authorized on twitch chat servers at all times with automatic
 * token updates.
 * @param PATH_CLIENT file path to the clientId and clientSecret
 * @param PATH_TOKENS file path to the tokens
 * @returns returns the chatClient object used with listening to events.
 */
exports.auth = async function (PATH_CLIENT,PATH_TOKENS) {
    const clientData = JSON.parse(await fs.readFile(PATH_CLIENT, 'UTF-8'));
    const tokenData = JSON.parse(await fs.readFile(PATH_TOKENS, 'UTF-8'));
    const twitchClient = await TwitchClient.withCredentials(clientData.clientId, tokenData.accessToken, undefined, {
        clientSecret: clientData.clientSecret,
        refreshToken: tokenData.refreshToken,
        expiry: tokenData.expiryTimestamp === null ? null : new Date(tokenData.expiryTimestamp),
        onRefresh: async ({accessToken, refreshToken, expiryDate}) => {
            console.log("Refreshing Access Token");
            const newTokenData = {
                accessToken,
                refreshToken,
                expiryTimestamp: expiryDate === null ? null : expiryDate.getTime()
            };
            await fs.writeFile(PATH_TOKENS, JSON.stringify(newTokenData, null, 4), 'UTF-8')
        }
    });
    return await ChatClient.forTwitchClient(twitchClient);
}