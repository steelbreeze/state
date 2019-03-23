"use strict";
exports.__esModule = true;
var _1 = require(".");
var Instance = /** @class */ (function () {
    function Instance(name, root) {
        var _this = this;
        this.name = name;
        this.root = root;
        this.cleanState = {};
        this.dirtyState = {};
        this.dirtyVertex = {};
        this.deferredEventPool = [];
        this.transaction(function () { return _this.root.doEnter(_this, false, _this.root); });
    }
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
    Instance.prototype.transaction = function (operation) {
        try {
            var result = operation(); // perform the transactional operation
            for (var keys = Object.keys(this.dirtyState), i = keys.length; i--;) { // update the clean state
                this.cleanState[keys[i]] = this.dirtyState[keys[i]];
            }
            return result; // return to the caller
        }
        finally {
            this.dirtyState = {}; // reset the dirty state
            this.dirtyVertex = {};
        }
    };
    Instance.prototype.defer = function (instance, trigger) {
        _1.log.write(function () { return instance + " deferring " + trigger; }, _1.log.Evaluate);
        this.deferredEventPool.unshift(trigger);
    };
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
    Instance.prototype.setVertex = function (vertex) {
        if (vertex.parent) {
            this.dirtyVertex[vertex.parent.toString()] = vertex;
            if (vertex instanceof _1.State) {
                this.dirtyState[vertex.parent.toString()] = vertex;
            }
        }
    };
    Instance.prototype.getState = function (region) {
        return this.dirtyState[region.toString()] || this.cleanState[region.toString()];
    };
    Instance.prototype.getVertex = function (region) {
        return this.dirtyVertex[region.toString()] || this.cleanState[region.toString()];
    };
    Instance.prototype.getLastKnownState = function (region) {
        return this.cleanState[region.toString()];
    };
    Instance.prototype.toString = function () {
        return this.name;
    };
    return Instance;
}());
exports.Instance = Instance;
