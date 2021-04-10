"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Region = void 0;
const _1 = require(".");
/**
 * A region is a container of vertices (states and pseudo states) within a state machine model.
 */
class Region {
    /**
     * Creates a new instance of the Region class.
     * @param name The name of the region.
     * @param parent The parent state of this region.
     */
    constructor(name, parent) {
        this.name = name;
        this.parent = parent;
        /**
         * The child  vertices of this region.
         * @internal
         * @hidden
         */
        this.children = [];
        _1.log.write(() => `Created ${this}`, _1.log.Create);
        parent.children.push(this);
    }
    /**
     * Tests a state machine instance to see if this region is complete within it.
     * A region is complete if it's current state is a final state (one with no outgoing transitions).
     * @internal
     * @hidden
     */
    isComplete(transaction) {
        const currentState = transaction.get(this);
        return currentState !== undefined && currentState.isFinal();
    }
    /**
     * Enters an element during a state transition.
     * @param transaction The current transaction being executed.
     * @param history Flag used to denote deep history semantics are in force at the time of entry.
     * @param trigger The event that triggered the state transition.
     * @internal
     * @hidden
     */
    doEnter(transaction, history, trigger) {
        this.doEnterHead(transaction);
        this.doEnterTail(transaction, history, trigger);
    }
    /**
     * Performs the initial steps required to enter an element during a state transition.
     * @param transaction The current transaction being executed.
     * @param history Flag used to denote deep history semantics are in force at the time of entry.
     * @param trigger The event that triggered the state transition.
     * @internal
     * @hidden
     */
    doEnterHead(transaction) {
        _1.log.write(() => `${transaction.instance} enter ${this}`, _1.log.Entry);
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
        const current = transaction.get(this);
        const starting = isHistory(this, _1.PseudoStateKind.History) && current ? current : this.initial;
        if (starting) {
            starting.doEnter(transaction, isHistory(this, _1.PseudoStateKind.DeepHistory), trigger);
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
        _1.log.write(() => `${transaction.instance} leave ${this}`, _1.log.Exit);
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
    /**
     * Returns the element in string form; the fully qualified name of the element.
     */
    toString() {
        return `${this.parent}.${this.name}`;
    }
}
exports.Region = Region;
function isHistory(region, kind) {
    return region.initial !== undefined && !!(region.initial.kind & kind);
}
