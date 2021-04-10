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
        this.vertexToEnter = toEnter(transaction, this.target);
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
function toEnter(transaction, vertex) {
    while (vertex && vertex.parent && vertex.parent.parent && vertex.parent.parent.isActive(transaction)) {
        vertex = vertex.parent.parent;
    }
    return vertex;
}
