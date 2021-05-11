class Command{
    enabled;
    commandName;
    response;

    constructor(enabled,commandName, response) {
        this.enabled = enabled;
        this.commandName = commandName;
        this.response = response;
    }

    getResponse() {
        return this.response;
    }

    getCommandName() {
        return this.commandName;
    }

}