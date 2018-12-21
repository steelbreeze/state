"use strict";
exports.__esModule = true;
var util_1 = require("../util");
var runtime_1 = require("../runtime");
/**
 * Represents the active state configuration of a state machine instance.
 * @remarks This is the default implementation of the IInstance class and reads/writes to the active state configuration in a transactional manner at both initilisation and each call to evaluate.
 */
var Instance = /** @class */ (function () {
    /**
     * Creates an instance of the Instance class.
     * @param name The name of the state machine instance.
     * @param root The root element of the state machine model that this an instance of.
     * @param activeStateConfiguration Optional JSON object used to initialise the active state configuration. The json object must have been produced by a prior call to Instance.toJSON from an instance using the same model.
     */
    function Instance(name, root) {
        var _this = this;
        this.name = name;
        this.root = root;
        /**
         * The last known state of each region in the state machine instance that has been entered.
         * @internal
         */
        this.cleanState = {};
        /**
         * The last known state of each region in the state machine instance that has been entered during a transaction.
         * @internal
         */
        this.dirtyState = {};
        /**
         * The last entered vertex of each region in the state machine instance that has been entered during a transaction.
         * @internal
         */
        this.dirtyVertex = {};
        /**
         * Outstanding events marked for deferral.
         */
        this.deferredEventPool = [];
        util_1.assert.ok(!root.parent, function () { return "The state provided as the root for an instance cannot have a parent"; });
        this.transaction(function () { return _this.root.enter(_this, false, _this.root); });
    }
    /**
     * Passes a trigger event to the state machine instance for evaluation.
     * @param trigger The trigger event to evaluate.
     * @returns Returns true if the trigger event was consumed by the state machine (caused a transition or was deferred).
     */
    Instance.prototype.evaluate = function (trigger) {
        var _this = this;
        util_1.log.info(function () { return _this + " evaluate " + trigger; }, util_1.log.Evaluate);
        return this.transaction(function () {
            // evaluate the trigger event passed
            var result = runtime_1.evaluate(_this.root, _this, false, trigger);
            // check for and evaluate any deferred events
            if (result && _this.deferredEventPool.length !== 0) {
                _this.evaluateDeferred();
            }
            return result;
        });
    };
    /**
     * Adds a trigger event to the event pool for later evaluation (once the state machine has changed state).
     * @param trigger The trigger event to defer.
     */
    Instance.prototype.defer = function (state, trigger) {
        var _this = this;
        util_1.log.info(function () { return _this + " deferred " + trigger + " while in " + state; }, util_1.log.Evaluate);
        this.deferredEventPool.push(trigger);
    };
    /** Check for and send deferred events for evaluation */
    Instance.prototype.evaluateDeferred = function () {
        var _this = this;
        // build the list of deferred event types based on the active state configuration
        var deferrableTriggers = this.deferrableTriggers(this.root);
        var _loop_1 = function (i) {
            var trigger = this_1.deferredEventPool[i];
            // if the event still exists in the pool and its not still deferred, take it and send to the machine for evaluation
            if (trigger && deferrableTriggers.indexOf(trigger.constructor) === -1) {
                delete this_1.deferredEventPool[i]; // NOTE: the transaction clean-up packs the event pool
                util_1.log.info(function () { return _this + " evaluate deferred " + trigger; }, util_1.log.Evaluate);
                // send for evaluation
                if (runtime_1.evaluate(this_1.root, this_1, false, trigger)) {
                    // if the event was consumed, start the process again
                    this_1.evaluateDeferred();
                    return "break";
                }
            }
        };
        var this_1 = this;
        // process the outstanding event pool
        for (var i = 0; i < this.deferredEventPool.length; i++) {
            var state_1 = _loop_1(i);
            if (state_1 === "break")
                break;
        }
    };
    /** Build a list of all the deferrable events at a particular state (including its children) */
    Instance.prototype.deferrableTriggers = function (state) {
        var _this = this;
        return state.children.reduce(function (result, region) { return result.concat(_this.deferrableTriggers(_this.getState(region))); }, state.deferrableTrigger);
    };
    /**
     * Performs an operation within a transactional context.
     * @param TReturn The type of the return parameter of the transactional operation.
     * @param operation The operation to perform within the transactional context.
     * @returns Returns the return value from the transactional context.
     */
    Instance.prototype.transaction = function (operation) {
        try {
            // perform the operation
            var result = operation();
            // commit the transaction cache to the clean state
            for (var k = Object.keys(this.dirtyState), i = k.length; i--;) {
                this.cleanState[k[i]] = this.dirtyState[k[i]];
            }
            // return the result to the caller
            return result;
        }
        finally {
            // clear the transaction cache
            this.dirtyState = {};
            this.dirtyVertex = {};
            // repack the deferred event pool
            this.deferredEventPool = this.deferredEventPool.filter(function (trigger) { return trigger; });
        }
    };
    /**
     * Updates the transactional state of a region with the last entered vertex.
     * @param vertex The vertex set as its parents last entered vertex.
     * @remarks This should only be called by the state machine runtime.
     */
    Instance.prototype.setVertex = function (vertex) {
        if (vertex.parent) {
            this.dirtyVertex[vertex.parent.qualifiedName] = vertex;
        }
    };
    /**
     * Updates the transactional state of a region with the last entered state.
     * @param state The state set as its parents last entered state.
     * @remarks This should only be called by the state machine runtime, and implementors note, you also need to update the last entered vertex within this call.
     */
    Instance.prototype.setState = function (state) {
        if (state.parent) {
            this.dirtyVertex[state.parent.qualifiedName] = state;
            this.dirtyState[state.parent.qualifiedName] = state;
        }
    };
    /**
     * Returns the last known state of a given region. This is the call for the state machine runtime to use as it returns the dirty transactional state.
     * @param region The region to get the last known state of.
     * @returns Returns the last known region of the given state. If the state has not been entered this will return undefined.
     */
    Instance.prototype.getState = function (region) {
        return this.dirtyState[region.qualifiedName] || this.cleanState[region.qualifiedName];
    };
    /**
     * Returns the last entered vertex to the state machine runtime.
     * @param region The region to get the last entered vertex of.
     * @returns Returns the last entered vertex for the given region.
     */
    Instance.prototype.getVertex = function (region) {
        return this.dirtyVertex[region.qualifiedName] || this.cleanState[region.qualifiedName];
    };
    /**
     * Returns the last known state of a given region. This is the call for application programmers to use as it returns the clean transactional state more efficently.
     * @param region The region to get the last known state of.
     * @returns Returns the last known region of the given state. If the state has not been entered this will return undefined.
     */
    Instance.prototype.getLastKnownState = function (region) {
        return this.cleanState[region.qualifiedName];
    };
    /**
     * Returns the name of the state machine instance.
     * @returns The name of the state machine instance.
     */
    Instance.prototype.toString = function () {
        return this.name;
    };
    return Instance;
}());
exports.Instance = Instance;
