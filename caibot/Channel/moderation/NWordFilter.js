const {ModerationFilter} = require("./ModerationFilter");
const rEnding = /\b(N|n|ℵ|П|IV|!V|]\/\\\/|\\\/\\)+[_., -]*? ?([ἰἱἲἳἴἵἶⅈἷἸἹἺἻἼἽἾἿỈỉỊịẛḭḮḯḬḻḷḹḽḻḬᶨᶦᶥᶩᶪᵢᵎᴵᴉ׀וӀˡɨɪɉǏǐłľĭĬŀīļĨĩĪîÎ¹⁞ⁱῐῑῒΐῖῗῘῙῚΊ¿?ᴉIiLl1ïÏíÍìÌ¡!jJrReE[\](\)|3]|\/|\\|\|)+[_., -]*? ?([GgQq69ℊ@-]|\\\/\\)+[_., -]*? ?([GgQqℊ69@-]|\\\/\\)+[_., -]*? ?([έⅇὲEeËë3Aa4]|\\\/\\)+[_., -]*? ?([R℟r2]|\\\/\\)/gmi;
const aEnding = /\b(N|n|ℵ|П|IV|!V|\/\\\/|\\\/\\)+[_., -]*? ?[\\\/\\|ἰἱἲἳἴⅈἵἶἷἸἹἺἻἼἽἾἿỈỉỊịẛḭḮḯḬḻḷḹḽḻḬᶨᶦᶥᶩᶪᵢᵎᴵᴉ׀וӀˡɨɪɉǏǐłľĭĬŀīļĨĩĪîÎ¹⁞ⁱῐῑῒΐῖῗῘῙῚΊ¿?ᴉIiLl1ïÏ?¿ᴉ¡ìÌíÍIiLl1[\](\)|!eE3-]+[_., -]*? ?[\/gG6@&q$ℊ]+[_., -]*? ?[\/gG6@&q$ℊ]+[_., -]*? ?[aA4áÁàÀ]/gmi;
const emoteMatch1 = /\b(TriHard|WideHard|cmonBruh|TriDance|TriKool|KevinTurtle|RlyTho)+( .* | )(niger)+?/gmi;
const emoteMatch2 = /\b(niger)+( .* | )(TriHard|WideHard|WideHardo|cmonBruh|TriDance|TriKool|KevinTurtle|RlyTho)+/gmi;

class NWordFilter extends ModerationFilter {
    constructor(filterType,description,enabled, ban, timeoutLength) {
        super(filterType,description,enabled, ban, timeoutLength);
    }

    checkIfMatch(message) {
        if (rEnding.exec(message) || aEnding.exec(message)) {
            let reason = `Racism | ${message}`
            return [true, this.getActionType(), reason];
        } else if (emoteMatch1.exec(message) || emoteMatch2.exec(message)) {
            let reason = `Inappropriate word + emote combo | ${message}`
            return [true,this.getActionType(),reason];
        }
    }


}
module.exports.NWordFilter = NWordFilter;