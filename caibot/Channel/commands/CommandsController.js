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


    get enabled() {
        return this.enabled;
    }
}
module.exports.CommandsController = CommandsController;