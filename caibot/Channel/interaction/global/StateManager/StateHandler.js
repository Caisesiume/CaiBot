const { startReactionManager } = require("./ReactionStateManager")

module.exports.startStateManager = async function(channelObjList,chatClient) {
    await startReactionManager(channelObjList,chatClient);
}