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
/**
 * Determines the vertex that will need to be entered; the first non-active vertex in the ancestry above the target vertex.
 * @param transaction
 * @param vertex
 * @returns
 * @hidden
 */
function toEnter(transaction, vertex) {
    while (vertex.parent && vertex.parent.parent && !vertex.parent.parent.isActive(transaction)) {
        vertex = vertex.parent.parent;
    }
    return vertex;
}
