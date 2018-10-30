"use strict";
exports.__esModule = true;
var runtime_1 = require("../runtime");
var Instance = /** @class */ (function () {
    function Instance(name, root) {
        this.name = name;
        this.root = root;
        this.cleanState = {}; // NOTE: this is the persistent representation of state machine state
        this.dirtyState = {}; //       this is the state machine state with the transaction context and will update lastKnownState on commit
        this.dirtyVertex = {}; //       this is transient within the transaction context and is discarded
        runtime_1.initialise(this);
    }
    Instance.prototype.beginTran = function () {
        this.dirtyState = {};
        this.dirtyVertex = {};
    };
    Instance.prototype.commitTran = function () {
        for (var k = Object.keys(this.dirtyState), i = k.length; i--;) {
            this.cleanState[k[i]] = this.dirtyState[k[i]];
        }
    };
    Instance.prototype.setVertex = function (vertex) {
        if (vertex.parent) {
            this.dirtyVertex[vertex.parent.qualifiedName] = vertex;
        }
    };
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
    Instance.prototype.toString = function () {
        return this.name;
    };
    return Instance;
}());
exports.Instance = Instance;
