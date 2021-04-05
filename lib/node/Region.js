"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Region = void 0;
const _1 = require(".");
/**
 * A region is a container of vertices (states and pseudo states) within a state machine model.
 */
class Region extends _1.NamedElement {
    /**
     * Creates a new instance of the Region class.
     * @param name The name of the region.
     * @param parent The parent state of this region.
     */
    constructor(name, parent) {
        super(name, parent);
        this.parent = parent;
        /**
         * The child  vertices of this region.
         * @internal
         * @hidden
         */
        this.children = [];
        parent.children.push(this);
    }
    /**
     * Tests a state machine instance to see if this region is complete within it.
     * A region is complete if it's current state is a final state (one with no outgoing transitions).
     * @internal
     * @hidden
     */
    isComplete(transaction) {
        const currentState = transaction.getState(this);
        return currentState !== undefined && currentState.isFinal();
    }
    /**
     * Performs the final steps required to enter the region dueing state transition; enters the region using the initial pseudo state or history logic.
     * @param transaction The current transaction being executed.
     * @param history Flag used to denote deep history semantics are in force at the time of entry.
     * @param trigger The event that triggered the state transition.
     * @internal
     * @hidden
     */
    doEnterTail(transaction, history, trigger) {
        const current = transaction.getState(this);
        const starting = (history || (this.initial && this.initial.isHistory)) && current ? current : this.initial;
        const deepHistory = history || (this.initial !== undefined && this.initial.kind === _1.PseudoStateKind.DeepHistory);
        if (starting) {
            starting.doEnter(transaction, deepHistory, trigger);
        }
        else {
            throw new Error(`Unable to find starting state in region ${this}`);
        }
    }
    /**
     * Exits a region during a state transition.
     * @param transaction The current transaction being executed.
     * @param history Flag used to denote deep history semantics are in force at the time of exit.
     * @param trigger The event that triggered the state transition.
     * @internal
     * @hidden
     */
    doExit(transaction, history, trigger) {
        const vertex = transaction.getVertex(this);
        if (vertex) {
            vertex.doExit(transaction, history, trigger);
        }
        super.doExit(transaction, history, trigger);
    }
    /**
     * Accepts a visitor and calls back its visitRegion method and cascade to child vertices.
     * @param visitor The visitor to call back.
     */
    accept(visitor) {
        visitor.visitRegion(this);
        for (const vertex of this.children) {
            vertex.accept(visitor);
        }
        visitor.visitRegionTail(this);
    }
}
exports.Region = Region;
