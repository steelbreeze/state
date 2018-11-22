"use strict";
exports.__esModule = true;
/**
 * Common base class for the three types of transition.
 * @param TTrigger The type of the trigger event that may cause this transition to be traversed.
 * @abstract
 * @public
 */
var Transition = /** @class */ (function () {
    /**
     * Creates a new instance of the TransitionBase class.
     * @param source The source vertex of the transition.
     * @param target The target vertex of the transition.
     * @protected
     */
    function Transition(source, target) {
        this.target = target;
        this.typeTest = function () { return true; };
        /**
         * The guard condition that determines if the transition should be traversed given a trigger.
         * @internal
         */
        this.guardTest = function () { return true; };
        /**
         * The behavior to call when the transition is traversed.
         * @internal
         */
        this.actions = [];
        source.outgoing.unshift(this);
    }
    /**
     * Performs a runtime type check on the type of the event passed in addition to any guard condition.
     * @param type The class of trigger
     * @Returns Returns the transitions.
     * @public
     */
    Transition.prototype.on = function (type) {
        this.typeTest = function (event) { return event.constructor === type; };
        return this;
    };
    /**
     * Adds a guard condition to the transition that determines if the transition should be traversed.
     * @param predicate A callback predicate that takes the trigger as a parameter and returns a boolean.
     * @returns Returns the transition.
     * @public
     */
    Transition.prototype["if"] = function (predicate) {
        this.guardTest = predicate;
        return this;
    };
    /**
     * Adds behaviour to the transition to be called every time the transition is traversed.
     * @param action The behaviour to call on transition traversal.
     * @returns Returns the transition.
     * @public
     * @deprecated Use the do method instead.
     */
    Transition.prototype["do"] = function (action) {
        this.actions.unshift(action); // NOTE: we use unshift as the runtime iterates in reverse
        return this;
    };
    /**
     * Adds behaviour to the transition to be called every time the transition is traversed.
     * @param action The behaviour to call on transition traversal.
     * @returns Returns the transition.
     * @public
     */
    Transition.prototype.effect = function (action) {
        return this["do"](action);
    };
    /**
     * Adds a guard condition to the transition that determines if the transition should be traversed given a trigger.
     * @param predicate A callback predicate that takes the trigger as a parameter and returns a boolean.
     * @returns Returns the transition.
     * @public
     * @deprecated
     */
    Transition.prototype.when = function (predicate) {
        return this["if"](predicate);
    };
    /**
     * Evaluates a trigger event against the transitions type test and guard condition to see if it should be traversed.
     * @param event The triggering event.
     * @return Returns true if the type test and guard conditions both pass.
     * @internal
     */
    Transition.prototype.evaluate = function (event) {
        return this.typeTest(event) && this.guardTest(event);
    };
    return Transition;
}());
exports.Transition = Transition;
