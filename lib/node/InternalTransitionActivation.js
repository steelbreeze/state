"use strict";
exports.__esModule = true;
var index_1 = require("./index");
/**
 * Semantics of local transitions. Local transitions do not chance the active state configuration when traversed.
 */
var InternalTransitionActivation = /** @class */ (function () {
    /**
     * Creates a new instance of the InternalTransitionActivation class.
     * @param source The source vertex of the internal transition.
     * @param target The target vertex of the internal transition.
     */
    function InternalTransitionActivation(source, target) {
        if (source instanceof index_1.State) {
            this.source = source;
        }
        else {
            throw new Error("Source of local transition must be a State.");
        }
    }
    /**
     * Exits the source of the transition
     * @param instance The state machine instance.
     * @param deepHistory True if deep history semantics are in force at the time of exit.
     * @param trigger The trigger event that caused the exit operation.
     */
    InternalTransitionActivation.prototype.exitSource = function (instance, deepHistory, trigger) {
        // don't exit anything
    };
    /**
     * Exits the target of the transition
     * @param instance The state machine instance.
     * @param deepHistory True if deep history semantics are in force at the time of entry.
     * @param trigger The trigger event that caused the exit operation.
     */
    InternalTransitionActivation.prototype.enterTarget = function (instance, deepHistory, trigger) {
        // test for completion transitions for internal transitions as there will be state entry/exit performed where the test is usually performed
        this.source.completion(instance, deepHistory, this.source);
    };
    /**
     * Returns the type of the transtiion.
     */
    InternalTransitionActivation.prototype.toString = function () {
        return "internal";
    };
    return InternalTransitionActivation;
}());
exports.InternalTransitionActivation = InternalTransitionActivation;
