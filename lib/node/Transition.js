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
/**
 * Maps TransitionKind to a TransitionStrategy.
 */
var TransitionStrategyMap = [];
TransitionStrategyMap[_1.TransitionKind.External] = ExternalTransitionStrategy_1.ExternalTransitionStrategy;
TransitionStrategyMap[_1.TransitionKind.Internal] = InternalTransitionStrategy_1.InternalTransitionStrategy;
TransitionStrategyMap[_1.TransitionKind.Local] = LocalTransitionStrategy_1.LocalTransitionStrategy;
/**
 * A transition changes the active state configuration of a state machine by specifying the valid transitions between states and the trigger events that cause them to be traversed.
 * @param TTrigger The type of trigger event that this transition will respond to.
 */
var Transition = /** @class */ (function () {
    /**
     * Creates a new instance of the Transition class. By defaily, this is an internal transition.
     * @param source The source vertex of the transition.
     * @internal
     * @hidden
     */
    function Transition(source) {
        this.source = source;
        /**
         * The optional guard condition that can further restrict the transition being traversed.
         * @internal
         * @hidden
         */
        this.guard = function () { return true; };
        /**
         * The user defined actions that will be called on transition traversal.
         * @internal
         * @hidden
         */
        this.traverseActions = [];
        this.target = source;
        this.strategy = new TransitionStrategyMap[_1.TransitionKind.Internal](this.source, this.target);
        this.source.outgoing.push(this);
    }
    /**
     * Adds an event type constraint to the transition; it will only be traversed if a trigger event of this type is evaluated.
     * @param eventType The type of trigger event that will cause this transition to be traversed.
     * @return Returns the transitions thereby allowing a fluent style transition construction.
     */
    Transition.prototype.on = function (eventType) {
        this.eventType = eventType;
        return this;
    };
    /**
     * Adds an guard condition to the transition; it will only be traversed if the guard condition evaluates true for a given trigger event.
     * @param guard A boolean predicate callback that takes the trigger event as a parameter.
     * @return Returns the transitions thereby allowing a fluent style transition construction.
     * @remarks It is recommended that this is used in conjunction with the on method, which will first test the type of the trigger event.
     */
    Transition.prototype.when = function (guard) {
        this.guard = guard;
        return this;
    };
    /**
     * Specifies a target vertex of the transition and the semantics of the transition.
     * @param target The target vertex of the transition.
     * @param kind The kind of transition, defining the precise semantics of how the transition will impact the active state configuration.
     * @return Returns the transitions thereby allowing a fluent style transition construction.
     */
    Transition.prototype.to = function (target, kind) {
        if (kind === void 0) { kind = _1.TransitionKind.External; }
        this.target = target;
        this.strategy = new TransitionStrategyMap[kind](this.source, this.target);
        return this;
    };
    /**
     * Adds user-defined behaviour to the transition that will be called after the source vertex has been exited and before the target vertex is entered.
     * @param actions The action, or actions to call with the trigger event as a parameter.
     * @return Returns the transitions thereby allowing a fluent style transition construction.
     */
    Transition.prototype.effect = function () {
        var _a;
        var actions = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            actions[_i] = arguments[_i];
        }
        (_a = this.traverseActions).push.apply(_a, __spread(actions));
        return this;
    };
    /**
     * Tests the trigger event against both the event type constraint and guard condition if specified.
     * @param trigger The trigger event.
     * @returns Returns true if the trigger event was of the event type and the guard condition passed if specified.
     * @internal
     * @hidden
     */
    Transition.prototype.evaluate = function (trigger) {
        return (this.eventType === undefined || trigger.constructor === this.eventType) && this.guard(trigger);
    };
    /**
     * Traverses a composite transition.
     * @param transaction The current transaction being executed.
     * @param history True if deep history semantics are in play.
     * @param trigger The trigger event.
     * @internal
     * @hidden
     */
    Transition.prototype.traverse = function (transaction, history, trigger) {
        var transition = this;
        var transitions = [transition];
        while (transition.target instanceof _1.PseudoState && transition.target.kind === _1.PseudoStateKind.Junction) {
            transitions.push(transition = transition.target.getTransition(trigger));
        }
        transitions.forEach(function (t) { return t.execute(transaction, history, trigger); });
    };
    /**
     * Traverses an individual transition.
     * @param transaction The current transaction being executed.
     * @param history True if deep history semantics are in play.
     * @param trigger The trigger event.
     * @internal
     * @hidden
     */
    Transition.prototype.execute = function (transaction, history, trigger) {
        var _this = this;
        _1.log.write(function () { return transaction.instance + " traverse " + _this; }, _1.log.Transition);
        this.strategy.doExitSource(transaction, history, trigger);
        this.traverseActions.forEach(function (action) { return action(trigger); });
        this.strategy.doEnterTarget(transaction, history, trigger);
    };
    /**
     * Returns the transition in string form.
     */
    Transition.prototype.toString = function () {
        return this.strategy + " transition from " + this.source + " to " + this.target;
    };
    return Transition;
}());
exports.Transition = Transition;
