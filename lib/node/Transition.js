"use strict";
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
exports.__esModule = true;
var _1 = require(".");
var ExternalTransitionStrategy_1 = require("./ExternalTransitionStrategy");
var InternalTransitionStrategy_1 = require("./InternalTransitionStrategy");
var LocalTransitionStrategy_1 = require("./LocalTransitionStrategy");
var TransitionStrategyMap = {
    external: ExternalTransitionStrategy_1.ExternalTransitionStrategy,
    internal: InternalTransitionStrategy_1.InternalTransitionStrategy,
    local: LocalTransitionStrategy_1.LocalTransitionStrategy
};
var Transition = /** @class */ (function () {
    function Transition(source) {
        this.source = source;
        this.traverseActions = [];
        this.target = source;
        this.strategy = new TransitionStrategyMap[_1.TransitionKind.Internal](this.source, this.target);
        this.source.outgoing.push(this);
    }
    Transition.prototype.on = function (eventType) {
        this.eventType = eventType;
        return this;
    };
    Transition.prototype.when = function (guard) {
        this.guard = guard;
        return this;
    };
    Transition.prototype.to = function (target, kind) {
        if (kind === void 0) { kind = _1.TransitionKind.External; }
        this.target = target;
        this.strategy = new TransitionStrategyMap[kind](this.source, this.target);
        return this;
    };
    Transition.prototype.effect = function () {
        var actions = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            actions[_i] = arguments[_i];
        }
        var _a;
        (_a = this.traverseActions).push.apply(_a, __spread(actions));
        return this;
    };
    Transition.prototype.evaluate = function (trigger) {
        return (this.eventType === undefined || trigger.constructor === this.eventType) && (this.guard === undefined || this.guard(trigger));
    };
    Transition.prototype.doTraverse = function (instance, history, trigger) {
        var transition = this;
        var transitions = [transition];
        while (transition.target instanceof _1.PseudoState && transition.target.kind === _1.PseudoStateKind.Junction) {
            transitions.push(transition = transition.target.getTransition(instance, trigger));
        }
        transitions.forEach(function (t) { return t.execute(instance, history, trigger); });
    };
    Transition.prototype.execute = function (instance, history, trigger) {
        var _this = this;
        _1.log.write(function () { return instance + " traverse " + _this; }, _1.log.Transition);
        this.strategy.doExitSource(instance, history, trigger);
        this.traverseActions.forEach(function (action) { return action(trigger); });
        this.strategy.doEnterTarget(instance, history, trigger);
    };
    Transition.prototype.toString = function () {
        return "transition from " + this.source + " to " + this.target;
    };
    return Transition;
}());
exports.Transition = Transition;
