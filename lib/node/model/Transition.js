"use strict";
exports.__esModule = true;
var util_1 = require("../util");
var PseudoState_1 = require("./PseudoState");
/** Determines the transition path for internal transitions. */
function internal(source, target) {
    return { leave: undefined, enter: [] };
}
exports.internal = internal;
/** Determines the transition path for external transitions. */
function external(source, target) {
    // determine the source and target vertex ancestries
    var sourceAncestors = util_1.tree.ancestors(source, function (element) { return element.parent; });
    var targetAncestors = util_1.tree.ancestors(target, function (element) { return element.parent; });
    // determine where to enter and exit from in the ancestries
    var from = util_1.tree.lca(sourceAncestors, targetAncestors) + 1; // NOTE: we enter/exit from the elements below the common ancestor
    var to = targetAncestors.length - (target instanceof PseudoState_1.PseudoState && target.isHistory() ? 1 : 0); // NOTE: if the target is a history pseudo state we just enter the parent region and it's history logic will come into play
    // initialise the base class with source, target and elements to exit and enter		
    return { leave: sourceAncestors[from], enter: targetAncestors.slice(from, to).reverse() };
}
exports.external = external;
/** Determines the transition path for local transitions. */
function local(source, target) {
    // determine the target ancestry
    var targetAncestors = util_1.tree.ancestors(target, function (element) { return element.parent; }); // NOTE: as the target is a child of the source it will be in the same ancestry
    // test that the target is a child of the source
    util_1.assert.ok(targetAncestors.indexOf(source) !== -1, function () { return "Source vertex (" + source + ") must an ancestor of the target vertex (" + target + ")"; });
    // determine where to enter and exit from in the ancestry
    var from = targetAncestors.indexOf(source) + 2; // NOTE: in local transitions the source vertex is not exited, but the active child substate is
    var to = targetAncestors.length - (target instanceof PseudoState_1.PseudoState && target.isHistory() ? 1 : 0); // NOTE: if the target is a history pseudo state we just enter the parent region and it's history logic will come into play
    // initialise the base class with source, target and elements to exit and enter
    return { leave: targetAncestors[from], enter: targetAncestors.slice(from, to).reverse() };
}
exports.local = local;
/**
 * A transition between vertices that defines a valid change in state in response to an event.
 * @param TTrigger The type of triggering event that causes this transition to be traversed.
 */
var Transition = /** @class */ (function () {
    /**
     * Creates an instance of the Transition class.
     * @param source The source [[Vertex]] of the transition.
     * @param type The type of triggering event that causes this transition to be traversed.
     * @public
     */
    function Transition(source, target, type) {
        if (target === void 0) { target = undefined; }
        if (type === void 0) { type = internal; }
        this.source = source;
        this.target = target;
        /**
         * A predicate used to test that the trigger if of the expected type.
         * @internal
         */
        this.typeTest = function () { return true; };
        /**
         * A predicate for a user-defined guard condition that must resolve true for the transition to be traversed.
         * @internal
         */
        this.guard = function () { return true; };
        /**
         * The behavior to call when the transition is traversed.
         * @internal
         */
        this.actions = [];
        // create the path based on the provided or default strategy
        this.path = type(this.source, this.target);
        source.outgoing.unshift(this);
        util_1.log.info(function () { return "Created transition from " + source; }, util_1.log.Create);
    }
    /**
     * Adds a predicate to the transition to ensure events must be of a certain event type for the transition to be traversed.
     * @param type The type of event to test for.
     * @return Returns the transition.
     * @public
     */
    Transition.prototype.on = function (type) {
        this.typeTest = function (trigger) { return trigger.constructor === type; };
        return this;
    };
    /**
     * Adds a guard condition to the transition enabling event details to determine if the transition should be traversed.
     * @param type A predicate taking the trigger event as a parameter.
     * @return Returns the transition.
     * @public
     */
    Transition.prototype.when = function (guard) {
        this.guard = guard;
        return this;
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
     * Specifies the target vertex, thereby making the transition an external transition.
     * @param target The target vertex of the transition
     * @return Returns the transition.
     * @public
     */
    Transition.prototype.to = function (target, type) {
        if (type === void 0) { type = external; }
        this.target = target;
        this.path = type(this.source, this.target);
        return this;
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
        if (this.target = (this.target || target)) {
            this.path = local(this.source, this.target);
        }
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
     * Adds behaviour to the transition to be called every time the transition is traversed.
     * @param action The behaviour to call on transition traversal.
     * @returns Returns the transition.
     * @public
     * @deprecated Use Transition.do instead. This method will be removed in the v8.0 release.
     */
    Transition.prototype.effect = function (action) {
        return this["do"](action);
    };
    /**
     * Tests an event against the type test and guard condition to see if the event might cause this transition to be traversed.
     * @param trigger The triggering event.
     * @returns Returns true if the trigger passes the type test and guard condition.
     * @internal
     */
    Transition.prototype.evaluate = function (trigger) {
        return this.typeTest(trigger) && this.guard(trigger);
    };
    return Transition;
}());
exports.Transition = Transition;
