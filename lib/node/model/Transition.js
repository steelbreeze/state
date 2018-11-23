"use strict";
exports.__esModule = true;
var util_1 = require("../util");
var PseudoState_1 = require("./PseudoState");
/**
 * A transition between vertices.
 * @param TTrigger The type of triggering event that causes this transition to be traversed.
 */
var Transition = /** @class */ (function () {
    /**
     * Creates an instance of the Transition class.
     * @param source The source [[Vertex]] of the transition.
     * @param type The type of triggering event that causes this transition to be traversed.
     * @param guard An optional guard condition to further restrict the transition traversal.
     * @param target The optional target of this transition. If not specified, the transition is an internal transition.
     * @param local A flag denoting that the transition is a local transition.
     * @param action An optional action to perform when traversing the transition.
     */
    function Transition(source, type, guard, target, local, action) {
        this.source = source;
        this.typeTest = function () { return true; };
        this.guard = function () { return true; };
        /**
         * The behavior to call when the transition is traversed.
         * @internal
         */
        this.actions = [];
        util_1.log.info(function () { return "Created transition from " + source; }, util_1.log.Create);
        if (type)
            this.on(type);
        if (guard)
            this["if"](guard);
        if (target)
            this.to(target);
        if (local)
            this.local();
        if (action)
            this["do"](action);
        source.outgoing.unshift(this);
    }
    Transition.prototype.on = function (type) {
        this.typeTest = function (trigger) { return trigger.constructor === type; };
        return this;
    };
    Transition.prototype["if"] = function (guard) {
        this.guard = guard;
        return this;
    };
    Transition.prototype.when = function (guard) {
        return this["if"](guard);
    };
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
    Transition.prototype.local = function () {
        if (this.target) {
            // determine the target ancestry
            var targetAncestors = util_1.tree.ancestors(this.target, function (element) { return element.parent; }); // NOTE: as the target is a child of the source it will be in the same ancestry
            // determine where to enter and exit from in the ancestry
            var from = targetAncestors.indexOf(this.source) + 2; // NOTE: in local transitions the source vertex is not exited, but the active child substate is
            var to = targetAncestors.length - (this.target instanceof PseudoState_1.PseudoState && this.target.isHistory() ? 1 : 0); // NOTE: if the target is a history pseudo state we just enter the parent region and it's history logic will come into play
            // initialise the base class with source, target and elements to exit and enter
            this.toLeave = targetAncestors[from];
            this.toEnter = targetAncestors.slice(from, to).reverse(); // NOTE: reversed as we use a reverse-for at runtime for performance
        }
        return this;
    };
    Transition.prototype["do"] = function (action) {
        this.actions.unshift(action);
        return this;
    };
    /**
     * Adds behaviour to the transition to be called every time the transition is traversed.
     * @param action The behaviour to call on transition traversal.
     * @returns Returns the transition.
     * @public
     * @deprecated Use Transition.do instead.
     */
    Transition.prototype.effect = function (action) {
        return this["do"](action);
    };
    Transition.prototype.evaluate = function (trigger) {
        return this.typeTest(trigger) && this.guard(trigger);
    };
    return Transition;
}());
exports.Transition = Transition;
