"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
exports.__esModule = true;
var _1 = require(".");
var State = /** @class */ (function (_super) {
    __extends(State, _super);
    function State(name, parent) {
        if (parent === void 0) { parent = undefined; }
        var _this = _super.call(this, name, parent instanceof State ? parent.getDefaultRegion() : parent) || this;
        _this.children = [];
        _this.deferrableTriggers = [];
        _this.entryActions = [];
        _this.exitActions = [];
        return _this;
    }
    State.prototype.entry = function () {
        var actions = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            actions[_i] = arguments[_i];
        }
        var _a;
        (_a = this.entryActions).push.apply(_a, __spread(actions));
        return this;
    };
    State.prototype.exit = function () {
        var actions = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            actions[_i] = arguments[_i];
        }
        var _a;
        (_a = this.exitActions).push.apply(_a, __spread(actions));
        return this;
    };
    State.prototype.defer = function () {
        var type = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            type[_i] = arguments[_i];
        }
        var _a;
        (_a = this.deferrableTriggers).push.apply(_a, __spread(type));
        return this;
    };
    State.prototype.getDefaultRegion = function () {
        return this.defaultRegion || (this.defaultRegion = new _1.Region("default", this));
    };
    State.prototype.isSimple = function () {
        return this.children.length === 0;
    };
    State.prototype.isComposite = function () {
        return this.children.length > 0;
    };
    State.prototype.isOrthogonal = function () {
        return this.children.length > 1;
    };
    State.prototype.isFinal = function () {
        return this.outgoing.length === 0;
    };
    State.prototype.isComplete = function (instance) {
        return !this.children.some(function (region) { return !region.isComplete(instance); });
    };
    State.prototype.evaluate = function (instance, history, trigger) {
        var result = this.delegate(instance, history, trigger) || _super.prototype.evaluate.call(this, instance, history, trigger) || this.deferrable(instance, trigger);
        if (result) {
            this.completion(instance, history);
        }
        return result;
    };
    State.prototype.delegate = function (instance, history, trigger) {
        var e_1, _a;
        var result = false;
        try {
            for (var _b = __values(this.children), _c = _b.next(); !_c.done; _c = _b.next()) {
                var region = _c.value;
                if (instance.getState(region).evaluate(instance, history, trigger)) {
                    result = true;
                    if (this.parent && instance.getState(this.parent) !== this) {
                        break;
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return result;
    };
    State.prototype.deferrable = function (instance, trigger) {
        if (this.deferrableTriggers.indexOf(trigger.constructor) !== -1) {
            instance.defer(trigger);
            return true;
        }
        return false;
    };
    State.prototype.getDeferrableTriggers = function (instance) {
        return this.children.reduce(function (result, region) { return result.concat(instance.getState(region).getDeferrableTriggers(instance)); }, this.deferrableTriggers);
    };
    State.prototype.doEnterHead = function (instance, history, trigger, next) {
        if (next)
            this.children.forEach(function (region) { if (region !== next)
                region.doEnter(instance, history, trigger); });
        _super.prototype.doEnterHead.call(this, instance, history, trigger, next);
        this.entryActions.forEach(function (action) { return action(trigger); });
    };
    State.prototype.doEnterTail = function (instance, history, trigger) {
        this.children.forEach(function (region) { return region.doEnter(instance, history, trigger); });
        this.completion(instance, history);
    };
    State.prototype.doExit = function (instance, history, trigger) {
        this.children.forEach(function (region) { return region.doExit(instance, history, trigger); });
        _super.prototype.doExit.call(this, instance, history, trigger);
        this.exitActions.forEach(function (action) { return action(trigger); });
    };
    State.prototype.completion = function (instance, history) {
        if (this.isComplete(instance)) {
            _super.prototype.evaluate.call(this, instance, history, this);
        }
    };
    return State;
}(_1.Vertex));
exports.State = State;
