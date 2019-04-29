"use strict";
exports.__esModule = true;
var _1 = require(".");
/**
 * Represents an instance of a state machine model at runtime; there can be many seperate state machine instances using a common model.
 */
var Instance = /** @class */ (function () {
    /**
     * Creates a new state machine instance conforming to a particular state machine model.
     * @param name The name of the state machine instance.
     * @param root The root state of the state machine instance.
     */
    function Instance(name, root) {
        var _this = this;
        this.name = name;
        this.root = root;
        /** The stable active state configuration of the state machine. */
        this.activeStateConfiguration = {};
        /**
         * The deferred triggers awaiting evaluation once the current active state configuration changes.
         * @internal
         * @hidden
         */
        this.deferredEventPool = [];
        this.transactional(function (transaction) { return _this.root.doEnter(transaction, false, _this.root); }); // enter the root element
    }
    /**
     * Evaluates a trigger event to see if it causes a state transition.
     * @param trigger The trigger event to evaluate.
     * @returns Returns true if the trigger event caused a change in the active state configuration or was deferred.
     */
    Instance.prototype.evaluate = function (trigger) {
        var _this = this;
        _1.log.write(function () { return _this + " evaluate " + trigger; }, _1.log.Evaluate);
        return this.transactional(function (transaction) {
            var result = _this.root.evaluate(transaction, false, trigger); // evaluate the trigger event
            if (result && _this.deferredEventPool.length !== 0) { // if there are deferred events, process them
                _this.evaluateDeferred(transaction);
                _this.deferredEventPool = _this.deferredEventPool.filter(function (t) { return t; }); // repack the deferred event pool
            }
            return result;
        });
    };
    /**
     * Performs an operation that may alter the active state configuration with a transaction.
     * @param TReturn The return type of the transactional operation.
     * @param operation The operation to perform within a transaction.
     * @param transaction The current transaction being executed; if not passed explicitly, one will be created on demand.
     * @return Returns the result of the operation.
     */
    Instance.prototype.transactional = function (operation, transaction) {
        if (transaction === void 0) { transaction = new _1.Transaction(this); }
        var result = operation(transaction);
        Object.assign(this.activeStateConfiguration, transaction.activeStateConfiguration);
        return result;
    };
    /**
     * Add a trigger event to the deferred event pool.
     * @param trigger The trigger event to add to the deferred event pool.
     * @internal
     * @hidden
     */
    Instance.prototype.defer = function (trigger) {
        var _this = this;
        _1.log.write(function () { return _this + " deferring " + trigger; }, _1.log.Evaluate);
        this.deferredEventPool.push(trigger);
    };
    /**
     * Evaluates trigger events in the deferred event pool.
     */
    Instance.prototype.evaluateDeferred = function (transaction) {
        var _this = this;
        this.deferredEventPool.forEach(function (trigger, i) {
            if (trigger && _this.root.getDeferrableTriggers(transaction).indexOf(trigger.constructor) === -1) {
                delete _this.deferredEventPool[i];
                _1.log.write(function () { return _this + " evaluate deferred " + trigger; }, _1.log.Evaluate);
                if (_this.root.evaluate(transaction, false, trigger)) {
                    _this.evaluateDeferred(transaction);
                    return;
                }
            }
        });
    };
    /**
     * Returns the last known state of a region from the stable active state configuration.
     * @param region The region to find the last know state of.
     * @returns Returns the last known state of the region or undefined if the region has not been entered.
     */
    Instance.prototype.getState = function (region) {
        return this.activeStateConfiguration[region.qualifiedName];
    };
    /**
     * Returns the name of the state machine instance.
     * @returns Returns the name of the state machine instance.
     */
    Instance.prototype.toString = function () {
        return this.name;
    };
    return Instance;
}());
exports.Instance = Instance;
