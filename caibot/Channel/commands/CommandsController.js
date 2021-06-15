const {Command} = require("./Command");
class CommandsController{
    enabled;
    commandList;
    constructor(enabled) {
        this.enabled = enabled;
        this.commandList = [];
    }

    async setCommands(commandsJson) {
        let listOfCommands = commandsJson.listOfCommands;
        for (let command of listOfCommands) {
            let newCommand = new Command(
                command.enabled,
                command.commandName,
                command.response,
                command.cooldown,
                command.permission
            );
            this.commandList.push(newCommand);
        }
    }

    isEnabled() {
        return this.enabled;
    }
}
module.exports.CommandsController = CommandsController;