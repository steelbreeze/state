"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalTransitionStrategy = void 0;
const _1 = require(".");
/**
 * Logic used to traverse internal transitions.
 * Internal transitions just execute transition traversal behaviour, then can trigger completion transitions.
 * @hidden
 */
class InternalTransitionStrategy {
    /**
     * Creates a new instance of the internal transaction strategy.
     * Internal transitions just perform the transition behaviour and do not enter or exit states when traversed.
     */
    constructor(target) {
        this.target = target;
    }
    /**
     * Just call the transition behaviour in place of entering the source.
     */
    doEnter(transaction, deepHistory) {
        if (this.target instanceof _1.State) {
            this.target.completion(transaction, deepHistory);
        }
    }
    doExit() {
    }
    toString() {
        return "internal";
    }
}
exports.InternalTransitionStrategy = InternalTransitionStrategy;
