"use strict";
exports.__esModule = true;
/**
 * Semantics of local transitions. The elements to exit and enter when traversing a local transition  depend on the active state configuration at the time of traversal.
 * @hidden
 */
var LocalTransitionActivation = /** @class */ (function () {
    /**
     * Creates a new instance of the LocalTransitionActivation class.
     * @param source The source vertex of the local transition.
     * @param target The target vertex of the local transition.
     */
    function LocalTransitionActivation(source, target) {
        this.target = target;
    }
    LocalTransitionActivation.prototype.exitSource = function (instance, deepHistory, trigger) {
        this.toEnter = this.target;
        // TODO: remove !'s
        // iterate towards the root until we find an active state
        while (this.toEnter.parent && !this.toEnter.parent.parent.isActive(instance)) {
            this.toEnter = this.toEnter.parent.parent;
        }
        // TODO: remove !'s
        // exit the currently active vertex in the target vertex's parent region
        if (!this.toEnter.isActive(instance) && this.toEnter.parent) {
            instance.getVertex(this.toEnter.parent).leave(instance, deepHistory, trigger);
        }
    };
    LocalTransitionActivation.prototype.enterTarget = function (instance, deepHistory, trigger) {
        if (this.toEnter && !this.toEnter.isActive(instance)) {
            this.toEnter.enter(instance, deepHistory, trigger);
        }
    };
    /**
     * Returns the type of the transtiion.
     */
    LocalTransitionActivation.prototype.toString = function () {
        return "local";
    };
    return LocalTransitionActivation;
}());
exports.LocalTransitionActivation = LocalTransitionActivation;
