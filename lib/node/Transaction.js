"use strict";
exports.__esModule = true;
/**
 * Represents a transaction within the execution of a state machine.
 * @hidden
 * @internal
 */
var Transaction = /** @class */ (function () {
    /**
     * Creates a new instance of the Transaction class.
     * @hidden
     * @internal
     */
    function Transaction(instance) {
        this.instance = instance;
        /**
         * The transactional active state configuration of the state machine.
         * @hidden
         * @internal
         */
        this.activeStateConfiguration = {};
        /** The last known vertex within a given region. */
        this.lastKnownVertex = {};
    }
    /**
     * Updates the last known state of the transaction.
     * @param state The state to set as the last known state of its parent region.
     * @hidden
     * @internal
     */
    Transaction.prototype.setState = function (state) {
        if (state.parent) {
            this.activeStateConfiguration[state.parent.qualifiedName] = state;
        }
    };
    /**
     * Returns the last known state of a given region within the transaction.
     * @param region The region to return the last known state of.
     * @returns Returns the last know state from the transaction cache; if not found, it defers to the state machine instance active state configuration.
     * @hidden
     * @internal
     */
    Transaction.prototype.getState = function (region) {
        return this.activeStateConfiguration[region.qualifiedName] || this.instance.getState(region);
    };
    /**
     * Updates the last known vertex of the transaction.
     * @param vertex The vertex to set as the last known state of its parent region.
     * @hidden
     * @internal
     */
    Transaction.prototype.setVertex = function (vertex) {
        if (vertex.parent) {
            this.lastKnownVertex[vertex.parent.qualifiedName] = vertex;
        }
    };
    /**
     * Returns the last known vertex of a given region within the transaction.
     * @param region The region to return the last known vertex of.
     * @returns Returns the last know vertex from the transaction cache; if not found, it defers to the state machine instance active state configuration.
     * @hidden
     * @internal
     */
    Transaction.prototype.getVertex = function (region) {
        return this.lastKnownVertex[region.qualifiedName] || this.instance.getState(region);
    };
    return Transaction;
}());
exports.Transaction = Transaction;
