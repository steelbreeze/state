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
        this.cleanState = {};
        /** The changes made to the active state configuration during transaction execution. */
        this.dirtyState = {};
        /** The the last known active vertex during transaction execution. */
        this.dirtyVertex = {};
        /** The deferred triggers awaiting evaluation once the current active state configuration changes. */
        this.deferredEventPool = [];
        this.transaction(function () { return _this.root.doEnter(_this, false, _this.root); }); // enter the root element
    }
    /**
     * Evaluates a trigger event to see if it causes a state transition.
     * @param trigger The trigger event to evaluate.
     * @returns Returns true if the trigger event caused a change in the active state configuration or was deferred.
     */
    Instance.prototype.evaluate = function (trigger) {
        var _this = this;
        _1.log.write(function () { return _this + " evaluate " + trigger; }, _1.log.Evaluate);
        return this.transaction(function () {
            var result = _this.root.evaluate(_this, false, trigger); // evaluate the trigger event
            if (result && _this.deferredEventPool.length !== 0) { // if there are deferred events, process them
                _this.evaluateDeferred();
                _this.deferredEventPool = _this.deferredEventPool.filter(function (t) { return t; }); // repack the deferred event pool
            }
            return result;
        });
    };
    /**
     * Performs an operation that may alter the active state configuration with a transaction.
     * @param operation The operation to perform within a transaction.
     */
    Instance.prototype.transaction = function (operation) {
        try {
            var result = operation(); // perform the transactional operation
            for (var keys = Object.keys(this.dirtyState), i = keys.length; i--;) { // update the active state configuration
                this.cleanState[keys[i]] = this.dirtyState[keys[i]];
            }
            return result;
        }
        finally {
            this.dirtyState = {}; // reset the dirty state
            this.dirtyVertex = {};
        }
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
        this.deferredEventPool.unshift(trigger);
    };
    /**
     * Evaluates trigger events in the deferred event pool.
     */
    Instance.prototype.evaluateDeferred = function () {
        var _this = this;
        var _loop_1 = function (i) {
            var trigger = this_1.deferredEventPool[i];
            if (trigger && this_1.root.getDeferrableTriggers(this_1).indexOf(trigger.constructor) === -1) {
                delete this_1.deferredEventPool[i];
                _1.log.write(function () { return _this + " evaluate deferred " + trigger; }, _1.log.Evaluate);
                if (this_1.root.evaluate(this_1, false, trigger)) {
                    this_1.evaluateDeferred();
                    return "break";
                }
            }
        };
        var this_1 = this;
        for (var i = this.deferredEventPool.length; i--;) {
            var state_1 = _loop_1(i);
            if (state_1 === "break")
                break;
        }
    };
    /**
     * Updates the transactional state on a change in the active vertex winth a region.
     * @param vertex The vertex to set as the currently active vertex for a region.
     * @internal
     * @hidden
     */
    Instance.prototype.setVertex = function (vertex) {
        if (vertex.parent) {
            this.dirtyVertex[vertex.parent.toString()] = vertex;
            if (vertex instanceof _1.State) {
                this.dirtyState[vertex.parent.toString()] = vertex;
            }
        }
    };
    /**
     * Retrieves the last known state for a region while in a transaction.
     * @param region The region to return the last know state of.
     * @returns Returns the last knows state or undefined if the region has not been entered.
     * @internal
     * @hidden
     */
    Instance.prototype.getState = function (region) {
        return this.dirtyState[region.toString()] || this.cleanState[region.toString()];
    };
    /**
     * Retrieves the last known vertex for a region while in a transaction.
     * @param region The region to return the last know vertex of.
     * @returns Returns the last knows vertex or undefined if the region has not been entered.
     * @remarks This differs slightly from getState in that the last know vertex could be a pseudo state.
     * @internal
     * @hidden
     */
    Instance.prototype.getVertex = function (region) {
        return this.dirtyVertex[region.toString()] || this.cleanState[region.toString()];
    };
    /**
     * Returns the last known state of a region from the stable active state configuration.
     * @param region The region to find the last know state of.
     * @returns Returns the last known state of the region or undefined if the region has not been entered.
     */
    Instance.prototype.getLastKnownState = function (region) {
        return this.cleanState[region.toString()];
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
