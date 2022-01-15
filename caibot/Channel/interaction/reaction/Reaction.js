class Reaction{
    randomEmote;
    subPhrase;
    resubPhrase;
    subEmote;

    constructor(isRandomEmote, specSubPhrase, specResubPhrase, specSubEmote) {
        this.randomEmote = isRandomEmote;
        this.subPhrase = specSubPhrase;
        this.resubPhrase = specResubPhrase;
        this.subEmote = specSubEmote;
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