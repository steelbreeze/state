"use strict";
exports.__esModule = true;
var util_1 = require("./util");
var PseudoStateKind_1 = require("./PseudoStateKind");
var State_1 = require("./State");
var PseudoState_1 = require("./PseudoState");
/**
 * Passes a trigger event to a state machine instance for evaluation
 * @param state The state to evaluate the trigger event against.
 * @param instance The state machine instance to evaluate the trigger against.
 * @param deepHistory True if deep history semantics are invoked.
 * @param trigger The trigger event
 * @returns Returns true if the trigger was consumed by the state.
 * @hidden
 */
function evaluate(state, instance, deepHistory, trigger) {
    var result = delegate(state, instance, deepHistory, trigger) || accept(state, instance, deepHistory, trigger) || doDefer(state, instance, trigger);
    // check completion transitions if the trigger caused as state transition and this state is still active
    if (result && state.parent && instance.getState(state.parent) === state) {
        completion(state, instance, deepHistory, state);
    }
    return result;
}
exports.evaluate = evaluate;
/** Delegate a trigger to children for evaluation */
function delegate(state, instance, deepHistory, trigger) {
    var result = false;
    // delegate to the current state of child regions for evaluation
    for (var i = state.children.length; i--;) {
        if (evaluate(instance.getState(state.children[i]), instance, deepHistory, trigger)) {
            result = true;
            // if a transition in a child state causes us to exit this state, break out now 
            if (state.parent && instance.getState(state.parent) !== state) {
                break;
            }
        }
    }
    return result;
}
exports.delegate = delegate;
/** Accept a trigger and vertex: evaluate the guard conditions of the transitions and traverse if one evaluates true. */
function accept(vertex, instance, deepHistory, trigger) {
    var result = false;
    var transition = vertex.getTransition(trigger);
    if (transition) {
        transition.traverse(instance, deepHistory, trigger);
        result = true;
    }
    return result;
}
exports.accept = accept;
/** Evaluates the trigger event against the list of deferred transitions and defers into the event pool if necessary. */
function doDefer(state, instance, trigger) {
    var result = false;
    if (state.deferrableTrigger.indexOf(trigger.constructor) !== -1) {
        instance.defer(state, trigger);
        result = true;
    }
    return result;
}
exports.doDefer = doDefer;
/** Checks for and executes completion transitions */
function completion(state, instance, deepHistory, trigger) {
    // check to see if the state is complete; fail fast if its not
    for (var i = state.children.length; i--;) {
        if (!instance.getState(state.children[i]).isFinal()) {
            return;
        }
    }
    // look for transitions
    accept(state, instance, deepHistory, trigger);
}
exports.completion = completion;
/** Initiate pseudo state entry */
PseudoState_1.PseudoState.prototype.enterHead = function (instance, deepHistory, trigger, nextElement) {
    var _this = this;
    util_1.log.info(function () { return instance + " enter " + _this; }, util_1.log.Entry);
    // update the current vertex of the parent region
    instance.setVertex(this);
};
/** Complete pseudo state entry */
PseudoState_1.PseudoState.prototype.enterTail = function (instance, deepHistory, trigger) {
    // a pseudo state must always have a completion transition (junction pseudo state completion occurs within the traverse method above)
    if (this.kind !== PseudoStateKind_1.PseudoStateKind.Junction) {
        accept(this, instance, deepHistory, trigger);
    }
};
/** Leave a pseudo state */
PseudoState_1.PseudoState.prototype.leave = function (instance, deepHistory, trigger) {
    var _this = this;
    util_1.log.info(function () { return instance + " leave " + _this; }, util_1.log.Exit);
};
/** Initiate state entry */
State_1.State.prototype.enterHead = function (instance, deepHistory, trigger, nextElement) {
    var _this = this;
    // when entering a state indirectly (part of the target ancestry in a transition that crosses region boundaries), ensure all child regions are entered
    if (nextElement) {
        // enter all child regions except for the next in the ancestry
        for (var i = this.children.length; i--;) {
            if (this.children[i] !== nextElement) {
                this.children[i].enter(instance, deepHistory, trigger);
            }
        }
    }
    util_1.log.info(function () { return instance + " enter " + _this; }, util_1.log.Entry);
    // update the current state and vertex of the parent region
    instance.setState(this);
    // perform the user defined entry behaviour
    for (var i = this.onEnter.length; i--;) {
        this.onEnter[i](trigger);
    }
};
/** Complete state entry */
State_1.State.prototype.enterTail = function (instance, deepHistory, trigger) {
    // cascade the enter operation to child regions
    for (var i = this.children.length; i--;) {
        this.children[i].enter(instance, deepHistory, trigger);
    }
    // test for completion transitions
    completion(this, instance, deepHistory, this);
};
/** Leave a state */
State_1.State.prototype.leave = function (instance, deepHistory, trigger) {
    var _this = this;
    // cascade the leave operation to all child regions
    for (var i = this.children.length; i--;) {
        this.children[i].leave(instance, deepHistory, trigger);
    }
    util_1.log.info(function () { return instance + " leave " + _this; }, util_1.log.Exit);
    // perform the user defined leave behaviour
    for (var i_1 = this.onLeave.length; i_1--;) {
        this.onLeave[i_1](trigger);
    }
};
