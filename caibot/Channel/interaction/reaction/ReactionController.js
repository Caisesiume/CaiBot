const {Reaction} = require("./Reaction");
const IOHelper = require("../../../utils/io-handler")
class ReactionController{
    enabled;
    reaction;
    constructor(enabled) {
        this.enabled = enabled;
    }

    async setReaction(reactionJson) {
        this.reaction = new Reaction(
            reactionJson.reaction.randomEmote,
            reactionJson.reaction.subPhrase,
            reactionJson.reaction.resubPhrase,
            reactionJson.reaction.subEmote
        );
    }

    isEnabled() {
        return this.enabled;
    }

    /**
     * This fuctions sets the state of this module as either enabled or not.
     * --Possible future update: Remove coupling (need) of the channel name.--
     * @param {Boolean} state needs to be either true or false.
     */
    setEnabled(channel, state) {
        this.enabled = state;
        IOHelper.saveReactionState(channel, state)
    }

    getSettings() {
        return this.reaction;
    }
}
module.exports.ReactionController = ReactionController;