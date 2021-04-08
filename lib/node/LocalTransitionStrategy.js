"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalTransitionStrategy = void 0;
/**
 * Logic used to traverse local transitions.
 */
class LocalTransitionStrategy {
    constructor(target) {
        this.target = target;
    }
    doExitSource(transaction, history, trigger) {
        this.vertexToEnter = this.target;
        const parent = this.vertexToEnter.parent;
        while (parent && parent.parent && !parent.parent.isActive(transaction)) {
            this.vertexToEnter = parent.parent;
        }
        if (!this.vertexToEnter.isActive(transaction) && parent) {
            const vertex = transaction.getVertex(parent);
            if (vertex) {
                vertex.doExit(transaction, history, trigger);
            }
        }
    }
    doEnterTarget(transaction, history, trigger) {
        if (this.vertexToEnter && !this.vertexToEnter.isActive(transaction)) {
            this.vertexToEnter.doEnter(transaction, history, trigger);
        }
    }
    toString() {
        return "local";
    }
}
exports.LocalTransitionStrategy = LocalTransitionStrategy;
