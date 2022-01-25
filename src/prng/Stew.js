// From http://baagoe.com/en/RandomMusings/javascript/
export default function StewPRNG() {
    // Johannes Baagøe <baagoe@baagoe.com>, 2010
    let args = Array.prototype.slice.call(arguments);
    let s = 0;
    let n = 109816851;

    if (args.length === 0) {
        args = [+new Date];
    }

    for (var i = 0; i < args.length; i++) {
        const a = args[i].toString();
        for (var j = 0; j < a.length; j++) {
            s += a.charCodeAt(j);
            s *= n;
            n *= j + 1;
            s = s * (((j + 1) * 102.109812) % 98376.120938) + n
        }
    }

    var random = function () {
        var t = 12391639 * s * 2.3283064365386963e-10; // 2^-32
        s = t
        const v = ((
            Math.cos(t*2.0 * 71.12098 + 912.125) +
            Math.cos(t*2.0 * 1098.120 + 12983)*2.0 +
            Math.cos(t*2.0 * 223098.120 * 5098.120)*4 +
            Math.cos(t*2.0 * 30971.12098 + 13912.125)*8
        ) + 15) / 30
        s = v * 19820398102
        return v
        // return t - (s = t | 0);
    };
    random.uint32 = function () {
        return random() * 0x100000000; // 2^32
    };
    random.fract53 = function () {
        return random() +
            (random() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
    };
    random.version = 'Stew 0.1';
    random.args = args;
    return random;

}
