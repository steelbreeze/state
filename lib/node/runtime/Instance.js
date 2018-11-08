"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var model = __importStar(require("../model"));
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
        if (activeStateConfiguration) {
            this.transaction(function () { return _this.stateFromJSON(_this.root, activeStateConfiguration); });
        }
        else {
            this.transaction(function () { return _this.root.enter(_this, false, undefined); });
        }
    }
    /**
     * Passes a trigger event to the state machine instance for evaluation.
     * @param trigger The trigger event to evaluate.
     * @returns Returns true if the trigger event caused a state transition.
     */
    Instance.prototype.evaluate = function (trigger) {
        var _this = this;
        util_1.log.info(function () { return _this + " evaluate " + typeof trigger + " trigger: " + trigger; }, util_1.log.Evaluate);
        return this.transaction(function () { return runtime_1.evaluate(_this.root, _this, false, trigger); });
    };
    /**
     * Performs an operation within a transactional context.
     * @param TReturn The type of the return parameter of the transactional operation.
     * @param operation The operation to perform within the transactional context.
     * @returns Returns the return value from the transactional context.
     */
    Instance.prototype.transaction = function (operation) {
        // clear the transaction cache
        this.dirtyState = {};
        this.dirtyVertex = {};
        // perform the operation
        var result = operation();
        // commit the transaction cache to the clean state
        for (var k = Object.keys(this.dirtyState), i = k.length; i--;) {
            this.cleanState[k[i]] = this.dirtyState[k[i]];
        }
        // return the result to the caller
        return result;
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
        return { name: region.name, children: region.children.filter(function (vertex) { return vertex instanceof model.State; }).reverse().map(function (state) { return _this.toJSON(state); }), lastKnownState: lastKnownState ? lastKnownState.name : undefined };
    };
    /**
     * Reconstruct the active state configuration of a state from a json object.
     * @param state The state to reconstruct.
     * @param jsonState The json object holding a serialized version of the active state configuration.
     * @internal
     */
    Instance.prototype.stateFromJSON = function (state, jsonState) {
        var _loop_1 = function (jsonRegion) {
            var region = state.children.filter(function (region) { return region.name === jsonRegion.name; })[0];
            util_1.assert.ok(region, function () { return "Unable to find region " + jsonRegion.name; });
            this_1.regionFromJSON(region, jsonRegion);
        };
        var this_1 = this;
        for (var _i = 0, _a = jsonState.children; _i < _a.length; _i++) {
            var jsonRegion = _a[_i];
            _loop_1(jsonRegion);
        }
    };
    /**
     * Reconstruct the active state configuration of a region from a json object.
     * @param region The region to reconstruct.
     * @param jsonRegion The json object holding a serialized version of the active state configuration.
     * @internal
     */
    Instance.prototype.regionFromJSON = function (region, jsonRegion) {
        var _loop_2 = function (jsonState) {
            var state = region.children.filter(function (vertex) { return vertex instanceof model.State && vertex.name === jsonState.name; })[0];
            util_1.assert.ok(state, function () { return "Unable to find state " + jsonState.name; });
            this_2.stateFromJSON(state, jsonState);
            if (state.name === jsonRegion.lastKnownState) {
                this_2.setState(state);
            }
        };
        var this_2 = this;
        for (var _i = 0, _a = jsonRegion.children; _i < _a.length; _i++) {
            var jsonState = _a[_i];
            _loop_2(jsonState);
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
