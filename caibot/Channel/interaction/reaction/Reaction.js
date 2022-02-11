class Reaction{
    emoteStack;
    randomEmote;
    subPhrase;
    resubPhrase;
    subEmote;

    constructor(emoteStack, isRandomEmote, specSubPhrase, specResubPhrase, specSubEmote) {
        this.emoteStack = emoteStack;
        this.randomEmote = isRandomEmote;
        this.subPhrase = specSubPhrase;
        this.resubPhrase = specResubPhrase;
        this.subEmote = specSubEmote;
    }
    
    hasEmoteStack(){
        return this.emoteStack;
    }

    hasRandomEmote() {
        return this.randomEmote;
    }

    getSubPhrase(){
        return this.subPhrase;
    }

    getResubPhrase() {
        return this.resubPhrase;
    }

    getSubEmote() {
        return this.subEmote;
    }
}
module.exports.Reaction = Reaction;