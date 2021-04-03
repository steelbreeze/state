"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Instance = void 0;
const _1 = require(".");
const Transaction_1 = require("./Transaction");
/**
 * Represents an instance of a state machine model at runtime; there can be many seperate state machine instances using a common model.
 */
class Instance {
    /**
     * Creates a new state machine instance conforming to a particular state machine model.
     * @param name The name of the state machine instance.
     * @param root The root state of the state machine instance.
     */
    constructor(name, root) {
        this.name = name;
        this.root = root;
        /** The stable active state configuration of the state machine, conveying the last known state for each region. */
        this.activeStateConfiguration = new Map();
        /**
         * The deferred triggers awaiting evaluation once the current active state configuration changes.
         * @internal
         * @hidden
         */
        this.deferredEventPool = [];
        this.transactional((transaction) => {
            this.root.doEnter(transaction, false, this.root); // enter the root element
            if (this.deferredEventPool.length !== 0) {
                this.evaluateDeferred(transaction);
                this.deferredEventPool = this.deferredEventPool.filter(t => t); // repack the deferred event pool
            }
        });
    }
    /**
     * Evaluates a trigger event to see if it causes a state transition.
     * @param trigger The trigger event to evaluate.
     * @returns Returns true if the trigger event caused a change in the active state configuration or was deferred.
     */
    evaluate(trigger) {
        _1.log.write(() => `${this} evaluate ${trigger}`, _1.log.Evaluate);
        if (this.transaction) {
            this.defer(trigger);
            return false;
        }
        else {
            return this.transactional((transaction) => {
                const result = this.root.evaluate(transaction, false, trigger); // evaluate the trigger event
                if (result && this.deferredEventPool.length !== 0) { // if there are deferred events, process them
                    this.evaluateDeferred(transaction);
                    this.deferredEventPool = this.deferredEventPool.filter(t => t); // repack the deferred event pool
                }
                return result;
            });
        }
    }
    /**
     * Performs an operation that may alter the active state configuration with a transaction.
     * @param TReturn The return type of the transactional operation.
     * @param operation The operation to perform within a transaction.
     * @return Returns the result of the operation.
     */
    transactional(operation) {
        try {
            this.transaction = new Transaction_1.Transaction(this);
            const result = operation(this.transaction);
            for (const [key, value] of this.transaction.activeStateConfiguration) {
                this.activeStateConfiguration.set(key, value);
            }
            return result;
        }
        finally {
            this.transaction = undefined;
        }
    }
    /**
     * Add a trigger event to the deferred event pool.
     * @param trigger The trigger event to add to the deferred event pool.
     * @internal
     * @hidden
     */
    defer(trigger) {
        _1.log.write(() => `${this} deferring ${trigger}`, _1.log.Evaluate);
        this.deferredEventPool.push(trigger);
    }
    /**
     * Evaluates trigger events in the deferred event pool.
     */
    evaluateDeferred(transaction) {
        this.deferredEventPool.forEach((trigger, i) => {
            if (trigger && this.root.getDeferrableTriggers(transaction).indexOf(trigger.constructor) === -1) {
                delete this.deferredEventPool[i];
                _1.log.write(() => `${this} evaluate deferred ${trigger}`, _1.log.Evaluate);
                if (this.root.evaluate(transaction, false, trigger)) {
                    this.evaluateDeferred(transaction);
                    return;
                }
            }
        });
    }
    /**
     * Returns the last known state of a region from the stable active state configuration.
     * @param region The region to find the last know state of.
     * @returns Returns the last known state of the region or undefined if the region has not been entered.
     */
    getState(region) {
        return this.activeStateConfiguration.get(region); // TODO: remove !
    }
    /**
     * Returns the name of the state machine instance.
     * @returns Returns the name of the state machine instance.
     */
    toString() {
        return this.name;
    }
}
exports.Instance = Instance;
