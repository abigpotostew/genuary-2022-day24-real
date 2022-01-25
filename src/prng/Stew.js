import Mash from './Mash';


// From http://baagoe.com/en/RandomMusings/javascript/
export default function StewPRNG() {
    // Johannes Baagøe <baagoe@baagoe.com>, 2010
    let args = Array.prototype.slice.call(arguments);
    let s = 0;
    const n = 109816851;

    if (args.length === 0) {
        args = [+new Date];
    }

    for (var i = 0; i < args.length; i++) {
        const a = args[i].toString();
        for (var j = 0; j < a.length; j++) {
            s += a.charCodeAt(j);
            s*=n;
            s=s>>>j+n
        }
    }

    var random = function () {
        var t = 2091639 * s * 2.3283064365386963e-10; // 2^-32
        s = t
        return Math.sin(t)+Math.sin(t*1098.120) + Math.sin(t*1098.120*1098.120)
        // return t - (s = t | 0);
    };
    random.uint32 = function () {
        return random() * 0x100000000; // 2^32
    };
    random.fract53 = function () {
        return random() +
            (random() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
    };
    random.version = 'Alea 0.9';
    random.args = args;
    return random;

}
