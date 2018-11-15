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
        /**
         * The guard condition that determines if the transition should be traversed given a trigger.
         * @internal
         */
        this.guard = function (trigger) { return true; };
        /**
         * The behavior to call when the transition is traversed.
         * @internal
         */
        this.actions = [];
        source.outgoing.unshift(this);
    }
    /**
     * Adds behaviour to the transition to be called every time the transition is traversed.
     * @param action The behaviour to call on transition traversal.
     * @returns Returns the transition.
     * @public
     */
    Transition.prototype.effect = function (action) {
        this.actions.unshift(action); // NOTE: we use unshift as the runtime iterates in reverse
        return this;
    };
    /**
     * Adds a guard condition to the transition that determines if the transition should be traversed given a trigger.
     * @param guard A callback predicate that takes the trigger as a parameter and returns a boolean.
     * @returns Returns the transition.
     * @public
     */
    Transition.prototype.when = function (guard) {
        this.guard = guard;
        return this;
    };
    return Transition;
}());
exports.Transition = Transition;
