class Command{
    enabled;
    commandName;
    response;
    cooldown;
    hasCooldown = false;
    permission;

    constructor(enabled,commandName, response, cooldown, permission) {
        this.commandName = commandName;
        this.response = response;
        this.enabled = enabled;
        this.cooldown = cooldown;
        this.permission = permission;
    }

    isOnCooldown(){
        return this._hasCooldown;
    }

    getEnabled() {
        return this.enabled;
    }

    getCooldown() {
        return this.cooldown;
    }

    getPermission() {
        return this.permission;
    }

    getResponse() {
        return this.response;
    }

    getCommandName() {
        return this.commandName;
    }


    setHasCooldown(value) {
        if (typeof value === "boolean"){
            this.hasCooldown = value;
        }
    }
}
module.exports.Command = Command;