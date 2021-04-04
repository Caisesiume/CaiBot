module.exports.addCPType = function () {
    return /!add +(?<type>[\d\w]{3,12})/gmi;
}

module.exports.editCPType = function () {
    return /!edit +(?<type>[\d\w]{3,12})/gmi;
}