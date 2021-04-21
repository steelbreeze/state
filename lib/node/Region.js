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
        this.vertices = [];
        _1.log.write(() => `Created ${this}`, _1.log.Create);
        parent.regions.push(this);
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
     * Determines if the region has a particular history semantic.
     * @hidden
     */
    history(deepHistory, kind) {
        return deepHistory || (this.initial !== undefined && !!(this.initial.kind & kind));
    }
    /**
     * Enters an element during a state transition.
     * @param transaction The current transaction being executed.
     * @param deepHistory Flag used to denote deep history semantics are in force at the time of entry.
     * @param trigger The event that triggered the state transition.
     * @internal
     * @hidden
     */
    doEnter(transaction, deepHistory, trigger, next) {
        _1.log.write(() => `${transaction.instance} enter ${this}`, _1.log.Entry);
        if (!next) {
            const starting = this.history(deepHistory, _1.PseudoStateKind.History) ? transaction.get(this) || this.initial : this.initial;
            if (starting) {
                starting.doEnter(transaction, this.history(deepHistory, _1.PseudoStateKind.DeepHistory), trigger, undefined);
            }
            else {
                throw new Error(`No staring vertex found when entering region ${this}`);
            }
        }
    }
    /**
     * Exits a region during a state transition.
     * @param transaction The current transaction being executed.
     * @param deepHistory Flag used to denote deep history semantics are in force at the time of exit.
     * @param trigger The event that triggered the state transition.
     * @internal
     * @hidden
     */
    doExit(transaction, deepHistory, trigger) {
        const vertex = transaction.getVertex(this);
        if (vertex) {
            vertex.doExit(transaction, deepHistory, trigger);
        }
        _1.log.write(() => `${transaction.instance} leave ${this}`, _1.log.Exit);
    }
    /**
     * Accepts a visitor and calls back its visitRegion method and cascade to child vertices.
     * @param visitor The visitor to call back.
     */
    accept(visitor) {
        visitor.visitRegion(this);
        this.vertices.forEach(vertex => vertex.accept(visitor));
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
