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
     */
    function Instance(name, root) {
        var _this = this;
        this.name = name;
        this.root = root;
        this.cleanState = {}; // NOTE: this is the persistent representation of state machine state
        this.dirtyState = {}; //       this is the state machine state with the transaction context and will update lastKnownState on commit
        this.dirtyVertex = {}; //       this is transient within the transaction context and is discarded
        // TODO: add a third param for JSON initialisation
        this.transaction(function () { return _this.root.enter(_this, false, undefined); });
    }
    // TODO: add a toJSON method
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
     * Returns the name of the state machine instance.
     * @returns The name of the state machine instance.
     */
    Instance.prototype.toString = function () {
        return this.name;
    };
    return Instance;
}());
exports.Instance = Instance;
