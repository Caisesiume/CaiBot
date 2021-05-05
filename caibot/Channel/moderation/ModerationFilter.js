class ModerationFilter {
    filterType
    description;
    enabled;
    ban;
    timeoutLength;
    constructor(filterType,description,enabled, ban, timeoutLength) {
        this.filterType = filterType;
        this.description = description;
        this.enabled = enabled;
        this.timeoutLength = timeoutLength;
        this.ban = ban;
    }
    getTimeoutLength() {
        return this.timeoutLength;
    }
    getDescription() {
        return this.description;
    }
    setTimeoutLength(timeoutLength) {
        this.timeoutLength = timeoutLength;
    }
    setEnableOrDisable(inputBool) {
        this.enabled = inputBool;
    }
    setBan(inputBool) {
        this.ban = inputBool;
    }

    isEnabled() {
        return this.enabled === true;
    }

    isBan() {
        return this.ban === true;
    }

    getFilterType() {
        return this.filterType;
    }

    getActionType() { //TODO Find a better solution to returning a ban
        if (!this.isBan()) {
            return this.timeoutLength;
        } else {
            return "ban";
        }
    }
}
module.exports.ModerationFilter = ModerationFilter;