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
            this.evaluateDeferred(transaction); // the process of initialisation may have caused a deferred event
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
                if (result) {
                    this.evaluateDeferred(transaction);
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
            // create a new transaction
            this.transaction = new Transaction_1.Transaction(this);
            // perform the requested operation
            const result = operation(this.transaction);
            // update the instance active state configuration from the transaction
            for (const [key, value] of this.transaction.activeStateConfiguration) {
                this.activeStateConfiguration.set(key, value);
            }
            return result;
        }
        finally {
            // remove the transaction
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
     * @hidden
     */
    evaluateDeferred(transaction) {
        if (this.deferredEventPool.length !== 0) {
            loop: for (let i = 0; i < this.deferredEventPool.length; i++) {
                const trigger = this.deferredEventPool[i];
                if (trigger && this.root.getDeferrableTriggers(transaction).indexOf(trigger.constructor) === -1) {
                    delete this.deferredEventPool[i];
                    _1.log.write(() => `${this} evaluate deferred ${trigger}`, _1.log.Evaluate);
                    if (this.root.evaluate(transaction, false, trigger)) {
                        this.evaluateDeferred(transaction);
                        break loop;
                    }
                }
            }
            this.deferredEventPool = this.deferredEventPool.filter(t => t); // repack the deferred event pool
        }
    }
    /**
     * Returns the last known state of a region from the stable active state configuration.
     * @param region The region to find the last know state of.
     * @returns Returns the last known state of the region or undefined if the region has not been entered.
     */
    getState(region) {
        return this.activeStateConfiguration.get(region);
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
