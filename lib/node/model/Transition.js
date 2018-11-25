"use strict";
exports.__esModule = true;
var util_1 = require("../util");
var PseudoState_1 = require("./PseudoState");
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
    function Transition(source) {
        this.source = source;
        this.typeTest = function () { return true; };
        this.guard = function () { return true; };
        /**
         * The elements to enter when traversing this transition; the entry operation on the last will cascade to any child substate.
         * @internal
         */
        this.toEnter = [];
        /**
         * The behavior to call when the transition is traversed.
         * @internal
         */
        this.actions = [];
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
     * @param type A boolean predicate taking the trigger event as a parameter.
     * @return Returns the transition.
     * @public
     */
    Transition.prototype.when = function (guard) {
        this.guard = guard;
        return this;
    };
    /**
     * A pseudonym of [[Transition.when]].
     * @param type A boolean predicate taking the trigger event as a parameter.
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
    Transition.prototype.to = function (target) {
        this.target = target;
        // determine the source and target vertex ancestries
        var sourceAncestors = util_1.tree.ancestors(this.source, function (element) { return element.parent; });
        var targetAncestors = util_1.tree.ancestors(target, function (element) { return element.parent; });
        // determine where to enter and exit from in the ancestries
        var from = util_1.tree.lca(sourceAncestors, targetAncestors) + 1; // NOTE: we enter/exit from the elements below the common ancestor
        var to = targetAncestors.length - (target instanceof PseudoState_1.PseudoState && target.isHistory() ? 1 : 0); // NOTE: if the target is a history pseudo state we just enter the parent region and it's history logic will come into play
        // initialise the base class with source, target and elements to exit and enter		
        this.toLeave = sourceAncestors[from];
        this.toEnter = targetAncestors.slice(from, to).reverse(); // NOTE: reversed as we use a reverse-for at runtime for performance
        return this;
    };
    /**
     * Specifies the target vertex which is a child of the source and specify it as a local transition.
     * @param target The target vertex of the transition
     * @return Returns the transition.
     * @public
     */
    Transition.prototype.local = function (target) {
        var _this = this;
        if (target === void 0) { target = undefined; }
        if (this.target = (this.target || target)) {
            // determine the target ancestry
            var targetAncestors = util_1.tree.ancestors(this.target, function (element) { return element.parent; }); // NOTE: as the target is a child of the source it will be in the same ancestry
            // test that the target is a child of the source
            util_1.assert.ok(targetAncestors.indexOf(this.source) !== -1, function () { return "Source vertex (" + _this.source + ") must an ancestor of the target vertex (" + _this.target + ")"; });
            // determine where to enter and exit from in the ancestry
            var from = targetAncestors.indexOf(this.source) + 2; // NOTE: in local transitions the source vertex is not exited, but the active child substate is
            var to = targetAncestors.length - (this.target instanceof PseudoState_1.PseudoState && this.target.isHistory() ? 1 : 0); // NOTE: if the target is a history pseudo state we just enter the parent region and it's history logic will come into play
            // initialise the base class with source, target and elements to exit and enter
            this.toLeave = targetAncestors[from];
            this.toEnter = targetAncestors.slice(from, to).reverse(); // NOTE: reversed as we use a reverse-for at runtime for performance
        }
        return this;
    };
    /**
     * Adds behaviour to the transition to be called every time the transition is traversed.
     * @remarks You may make multiple calls to this method to add more behaviour.
     * @param action The behaviour to call on transition traversal.
     * @returns Returns the transition.
     * @public
     * @deprecated Use Transition.do instead. This method will be removed in the v8.0 release.
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
