"use strict";
exports.__esModule = true;
var util_1 = require("../util");
var TransitionKind_1 = require("./TransitionKind");
/**
 * A transition between vertices that defines a valid change in state in response to an event.
 * @param TTrigger The type of triggering event that causes this transition to be traversed.
 */
var Transition = /** @class */ (function () {
    /**
     * Creates an instance of the Transition class.
     * @param source The source vertex of the transition.
     * @param target The optional target vertex of the transition; leave undefined for internal transitions.
     * @param kind The optional kind of the transition: external, internal or local. If left blank, this will be external if a targed vertex is specified otherwise internal.
     * @param type The optional type of the trigger event that will cause this transition to be traversed. If left undefined any object or primative type will be considered.
     * @public
     */
    function Transition(source, target, kind, type, guard) {
        if (target === void 0) { target = undefined; }
        if (kind === void 0) { kind = (target ? TransitionKind_1.TransitionKind.external : TransitionKind_1.TransitionKind.internal); }
        if (type === void 0) { type = undefined; }
        if (guard === void 0) { guard = function () { return true; }; }
        var _this = this;
        /**
         * A user-defined guard condition that must be true for the transition to be traversed.
         * @internal
         */
        this.userGuard = function () { return true; };
        /**
         * The behavior to call when the transition is traversed.
         * @internal
         */
        this.actions = [];
        this.source = source;
        this.target = target || source;
        this.activation = new TransitionKind_1.TransitionKind.map[kind](this.source, this.target);
        this.typeGuard = type ? function (trigger) { return trigger.constructor === type; } : function () { return true; };
        this.userGuard = guard;
        // add this transition to the set of outgoing transitions of the source vertex.
        source.outgoing.unshift(this);
        util_1.log.info(function () { return "Created " + _this; }, util_1.log.Create);
    }
    /**
     * Adds a predicate to the transition to ensure events must be of a certain event type for the transition to be traversed.
     * @param type The type of event to test for.
     * @return Returns the transition.
     * @public
     */
    Transition.prototype.on = function (type) {
        this.typeGuard = function (trigger) { return trigger.constructor === type; };
        return this;
    };
    /**
     * Adds a guard condition to the transition enabling event details to determine if the transition should be traversed.
     * @param type A predicate taking the trigger event as a parameter.
     * @return Returns the transition.
     * @public
     */
    Transition.prototype.when = function (guard) {
        this.userGuard = guard;
        return this;
    };
    /**
     * Specifies the target vertex, thereby making the transition an external transition.
     * @param target The target vertex of the transition
     * @return Returns the transition.
     * @public
     */
    Transition.prototype.to = function (target, kind) {
        var _this = this;
        if (kind === void 0) { kind = TransitionKind_1.TransitionKind.external; }
        this.target = target;
        this.activation = new TransitionKind_1.TransitionKind.map[kind](this.source, this.target);
        util_1.log.info(function () { return "- converted to " + _this; }, util_1.log.Create);
        return this;
    };
    /**
     * Adds behaviour to the transition to be called every time the transition is traversed.
     * @remarks You may make multiple calls to this method to add more behaviour.
     * @param action The behaviour to call on transition traversal.
     * @returns Returns the transition.
     * @public
     */
    Transition.prototype["do"] = function (action) {
        this.actions.unshift(action);
        return this;
    };
    /**
     * Tests an event against the type test and guard condition to see if the event might cause this transition to be traversed.
     * @param trigger The triggering event.
     * @returns Returns true if the trigger passes the type test and guard condition.
     * @internal
     */
    Transition.prototype.evaluate = function (trigger) {
        return this.typeGuard(trigger) && this.userGuard(trigger);
    };
    /**
     * Execute the user defined transition behaviour.
     * @param trigger The trigger event that caused the transition.
     */
    Transition.prototype.doActions = function (trigger) {
        for (var i = this.actions.length; i--;) {
            this.actions[i](trigger);
        }
    };
    /**
     * A pseudonym of [[Transition.when]].
     * @param type A predicate taking the trigger event as a parameter.
     * @return Returns the transition.
     * @public
     * @deprecated Use Transition.when in its place. This method will be removed in the v8.0 release.
     */
    Transition.prototype["if"] = function (guard) {
        return this.when(guard);
    };
    /**
     * Specifies the target vertex which is a child of the source and specify it as a local transition.
     * @param target The target vertex of the transition
     * @return Returns the transition.
     * @public
     * @deprecated Use the to method with the transition type of local
     */
    Transition.prototype.local = function (target) {
        if (target === void 0) { target = undefined; }
        if (this.target = (target || this.target)) {
            this.activation = new TransitionKind_1.TransitionKind.map[TransitionKind_1.TransitionKind.local](this.source, this.target);
        }
        return this;
    };
    /**
     * A pseudonym of do.
     * @param action The behaviour to call on transition traversal.
     * @returns Returns the transition.
     * @public
     * @deprecated Use Transition.do instead. This method will be removed in the v8.0 release.
     */
    Transition.prototype.effect = function (action) {
        return this["do"](action);
    };
    Transition.prototype.toString = function () {
        return this.activation + " transition from " + this.source + " to " + this.target;
    };
    return Transition;
}());
exports.Transition = Transition;
