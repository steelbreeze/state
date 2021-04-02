"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalTransitionStrategy = void 0;
const _1 = require(".");
/**
 * Logic used to traverse internal transitions.
 */
class InternalTransitionStrategy {
    constructor(source, target) {
        this.target = target;
    }
    doEnterTarget(transaction, history, trigger) {
        if (this.target instanceof _1.State) {
            this.target.completion(transaction, history);
        }
    }
    doExitSource(transaction, history, trigger) {
    }
    toString() {
        return "internal";
    }
}
exports.InternalTransitionStrategy = InternalTransitionStrategy;
