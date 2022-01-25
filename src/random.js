import StewPRNG from "./prng/Stew";


export class PRNGRand {
    constructor(seed) {
        seed.toString()
        this.grand = new StewPRNG(seed)
        this.intrand = this.grand.uint32;
    }

    random(lo, hi) {
        if (lo === undefined && hi === undefined) return this.grand()
        if (hi === undefined && lo !== undefined) {
            return this.grand() * lo
        }
        return this.grand() * (hi - lo) + lo
    }

    randomReal() {
        return this.grand() - this.grand()
    }

    randomInt(lo, hi) {
        return Math.floor(this.random(lo, hi))
    }

    //
    // seed(seed) {
    //     // this.grand = arbit(seed)
    // }
}

export const grand = new PRNGRand(Date.now())
export default grand

