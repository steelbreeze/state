"use strict";
exports.__esModule = true;
var util_1 = require("./util");
var State_1 = require("./State");
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
    function Instance(name, root, activeStateConfiguration) {
        if (activeStateConfiguration === void 0) { activeStateConfiguration = undefined; }
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
        if (activeStateConfiguration) {
            this.transaction(function () { return _this.stateFromJSON(_this.root, activeStateConfiguration); });
        }
        else {
            this.transaction(function () { return _this.root.enter(_this, false, _this.root); });
        }
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
            var result = _this.root.evaluate(_this, false, trigger);
            // check for and evaluate any deferred events
            if (result && _this.deferredEventPool.length !== 0) {
                _this.evaluateDeferred();
                // repack the deferred event pool
                _this.deferredEventPool = _this.deferredEventPool.filter(function (trigger) { return trigger; });
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
        this.deferredEventPool.unshift(trigger);
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
                // take the event from the pool
                delete this_1.deferredEventPool[i];
                util_1.log.info(function () { return _this + " evaluate deferred " + trigger; }, util_1.log.Evaluate);
                // send for evaluation
                if (this_1.root.evaluate(this_1, false, trigger)) {
                    // if the event was consumed, start the process again
                    this_1.evaluateDeferred();
                    return "break";
                }
            }
        };
        var this_1 = this;
        // process the outstanding event pool
        for (var i = this.deferredEventPool.length; i--;) {
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
        }
    };
    /**
     * Updates the transactional state of a region with the last entered vertex.
     * @param vertex The vertex set as its parents last entered vertex.
     * @remarks This should only be called by the state machine runtime.
     */
    Instance.prototype.setVertex = function (vertex) {
        if (vertex.parent) {
            this.dirtyVertex[vertex.parent.toString()] = vertex;
        }
    };
    /**
     * Updates the transactional state of a region with the last entered state.
     * @param state The state set as its parents last entered state.
     * @remarks This should only be called by the state machine runtime, and implementors note, you also need to update the last entered vertex within this call.
     */
    Instance.prototype.setState = function (state) {
        if (state.parent) {
            this.dirtyVertex[state.parent.toString()] = state;
            this.dirtyState[state.parent.toString()] = state;
        }
    };
    /**
     * Returns the last known state of a given region. This is the call for the state machine runtime to use as it returns the dirty transactional state.
     * @param region The region to get the last known state of.
     * @returns Returns the last known region of the given state. If the state has not been entered this will return undefined.
     */
    Instance.prototype.getState = function (region) {
        return this.dirtyState[region.toString()] || this.cleanState[region.toString()];
    };
    /**
     * Returns the last entered vertex to the state machine runtime.
     * @param region The region to get the last entered vertex of.
     * @returns Returns the last entered vertex for the given region.
     */
    Instance.prototype.getVertex = function (region) {
        return this.dirtyVertex[region.toString()] || this.cleanState[region.toString()];
    };
    /**
     * Returns the last known state of a given region. This is the call for application programmers to use as it returns the clean transactional state more efficently.
     * @param region The region to get the last known state of.
     * @returns Returns the last known region of the given state. If the state has not been entered this will return undefined.
     */
    Instance.prototype.getLastKnownState = function (region) {
        return this.cleanState[region.toString()];
    };
    /**
     * Serialize the active state configuration of the state machine instance to JSON.
     * @param Optional starting state; defaults to the root element within the state machine model.
     * @returns Returns the JSON representation of the active state configuration. This contains just the hierarchy of states and regions with the last known state of each region.
     */
    Instance.prototype.toJSON = function (state) {
        var _this = this;
        if (state === void 0) { state = this.root; }
        return { name: state.name, children: state.children.map(function (region) { return _this.regionToJSON(region); }).reverse() };
    };
    /**
     * Seriaize the active state configuration of a region to JSON.
     * @param region The region to serialize.
     * @returns Returns the JSON representation of the active state configuration of the region.
     * @internal
     */
    Instance.prototype.regionToJSON = function (region) {
        var _this = this;
        var lastKnownState = this.getLastKnownState(region);
        return { name: region.name, children: region.children.filter(function (vertex) { return vertex instanceof State_1.State; }).reverse().map(function (state) { return _this.toJSON(state); }), lastKnownState: lastKnownState ? lastKnownState.name : undefined };
    };
    /**
     * Reconstruct the active state configuration of a state from a json object.
     * @param state The state to reconstruct.
     * @param jsonState The json object holding a serialized version of the active state configuration.
     * @internal
     */
    Instance.prototype.stateFromJSON = function (state, jsonState) {
        var _loop_2 = function (i, l) {
            var jsonRegion = jsonState.children[i];
            var region = state.children.filter(function (region) { return region.name === jsonRegion.name; })[0];
            util_1.assert.ok(region, function () { return "Unable to find region " + jsonRegion.name; });
            this_2.regionFromJSON(region, jsonRegion);
        };
        var this_2 = this;
        for (var i = 0, l = jsonState.children.length; i < l; ++i) {
            _loop_2(i, l);
        }
    };
    /**
     * Reconstruct the active state configuration of a region from a json object.
     * @param region The region to reconstruct.
     * @param jsonRegion The json object holding a serialized version of the active state configuration.
     * @internal
     */
    Instance.prototype.regionFromJSON = function (region, jsonRegion) {
        var _loop_3 = function (i, l) {
            var jsonState = jsonRegion.children[i];
            var state = region.children.filter(function (vertex) { return vertex instanceof State_1.State && vertex.name === jsonState.name; })[0];
            util_1.assert.ok(state, function () { return "Unable to find state " + jsonState.name; });
            this_3.stateFromJSON(state, jsonState);
            if (state.name === jsonRegion.lastKnownState) {
                this_3.setState(state);
            }
        };
        var this_3 = this;
        for (var i = 0, l = jsonRegion.children.length; i < l; ++i) {
            _loop_3(i, l);
        }
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
