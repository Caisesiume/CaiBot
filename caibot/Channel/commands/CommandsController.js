const {Command} = require("./Command");

class CommandsController{
    enabled;
    commandList;
    constructor(enabled) {
        this.commandList = [];
        this.enabled = enabled;
    }

    async addBulk(listOfCommands) {
        for (let command of listOfCommands) {
            this.commandList.push(command)
        }
    }

    setCommands(commandsJson) {
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

    getEnabled() {
        return this.enabled;
    }
}
module.exports.CommandsController = CommandsController;