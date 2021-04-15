"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalTransitionStrategy = void 0;
/**
 * Logic used to traverse local transitions.
 * @hidden
 */
class LocalTransitionStrategy {
    constructor(target) {
        this.target = target;
        // NOTE: local transition behaviour is dependant on the active state configuration at the time of execution, hence logic is in doExitSource
    }
    /**
     * Leave the source of the transition as needed
     */
    doExit(transaction, deepHistory, trigger) {
        // Find the first inactive vertex abode the target
        this.vertexToEnter = toEnter(transaction, this.target);
        // exit the active sibling of the vertex to enter
        if (!this.vertexToEnter.isActive(transaction) && this.vertexToEnter.parent) {
            const vertex = transaction.getVertex(this.vertexToEnter.parent);
            if (vertex) {
                vertex.doExit(transaction, deepHistory, trigger);
            }
        }
    }
    doEnter(transaction, deepHistory, trigger) {
        if (this.vertexToEnter && !this.vertexToEnter.isActive(transaction)) {
            this.vertexToEnter.doEnter(transaction, deepHistory, trigger);
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
