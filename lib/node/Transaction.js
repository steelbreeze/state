"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const _1 = require("./");
/**
 * Represents a transaction within the execution of a state machine.
 * @hidden
 * @internal
 */
class Transaction extends Map {
    /**
     * Creates a new instance of the Transaction class.
     * @hidden
     * @internal
     */
    constructor(instance) {
        super();
        this.instance = instance;
        /** The last known vertex within a given region. */
        this.lastKnownVertex = new Map();
    }
    /**
     * Returns the last known state of a given region within the transaction.
     * @param region The region to return the last known state of.
     * @returns Returns the last know state from the transaction cache; if not found, it defers to the state machine instance active state configuration.
     * @hidden
     * @internal
     */
    getState(region) {
        return this.get(region) || this.instance.get(region);
    }
    /**
     * Updates the last known vertex of the transaction.
     * @param vertex The vertex to set as the last known state of its parent region.
     * @hidden
     * @internal
     */
    setVertex(vertex) {
        if (vertex.parent) {
            this.lastKnownVertex.set(vertex.parent, vertex);
            if (vertex instanceof _1.State) {
                this.set(vertex.parent, vertex);
            }
        }
    }
    /**
     * Returns the last known vertex of a given region within the transaction.
     * @param region The region to return the last known vertex of.
     * @returns Returns the last know vertex from the transaction cache; if not found, it defers to the state machine instance active state configuration.
     * @hidden
     * @internal
     */
    getVertex(region) {
        return this.lastKnownVertex.get(region) || this.instance.get(region);
    }
}
exports.Transaction = Transaction;
