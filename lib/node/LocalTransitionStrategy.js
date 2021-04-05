"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalTransitionStrategy = void 0;
/**
 * Logic used to traverse local transitions.
 */
class LocalTransitionStrategy {
    constructor(source, target) {
        this.source = source;
        this.target = target;
    }
    doExitSource(transaction, history, trigger) {
        this.vertexToEnter = this.target;
        while (this.vertexToEnter.parent && this.vertexToEnter.parent.parent && !this.vertexToEnter.parent.parent.isActive(transaction)) {
            this.vertexToEnter = this.vertexToEnter.parent.parent;
        }
        if (!this.vertexToEnter.isActive(transaction) && this.vertexToEnter.parent) {
            const vertex = transaction.getVertex(this.vertexToEnter.parent);
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
