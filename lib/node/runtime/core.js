"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var util_1 = require("../util");
var model = __importStar(require("../model"));
/**
 * Initialises a state machine instance to its starting state.
 * @param instance The state machine instance.
 * @public
 */
function initialise(instance) {
    instance.beginTran();
    // initialise the state machine by entering the root element
    instance.root.enterHead(instance, false, undefined);
    instance.root.enterTail(instance, false, undefined);
    instance.commitTran();
}
exports.initialise = initialise;
/**
 * Passes a trigger event into a state machine for evaluation.
 * @param instance The state machine instance to evaluate the trigger against.
 * @param trigger The trigger to evaluate.
 * @returns Returns true if the trigger caused a state transition.
 * @public
 */
function evaluate(instance, trigger) {
    util_1.log.info(function () { return instance + " evaluate " + typeof trigger + " trigger: " + trigger; }, util_1.log.Evaluate);
    instance.beginTran();
    var result = stateEvaluate(instance.root, instance, false, trigger);
    instance.commitTran();
    return result;
}
exports.evaluate = evaluate;
/**
 * Passes a trigger event to a state for evaluation
 */
function stateEvaluate(state, instance, deepHistory, trigger) {
    // first, delegate to child states for evaluation
    var result = delegateEvaluate(state, instance, deepHistory, trigger);
    // if a child state caused a transition, we can test for completion transitions, but only if we are still active
    if (result) {
        if (state.parent && instance.getState(state.parent) === state) {
            completion(state, instance, deepHistory, state);
        }
    }
    else { // otherwise, look for transitions from this state
        result = findAndTraverse(state, instance, deepHistory, trigger);
    }
    return result;
}
function delegateEvaluate(state, instance, deepHistory, trigger) {
    var result = false;
    var isActive = true;
    // first, delegate to child states for evaluation
    for (var i = state.children.length; isActive && i--;) {
        if (stateEvaluate(instance.getState(state.children[i]), instance, deepHistory, trigger)) {
            // if a transition in a child state causes us to exit this state, break out now 
            isActive = state.parent === undefined || instance.getState(state.parent) === state;
            result = true;
        }
    }
    return result;
}
function findAndTraverse(vertex, instance, deepHistory, trigger) {
    var transition = vertex.getTransition(trigger);
    if (transition) {
        traverse(transition, instance, deepHistory, trigger);
        return true;
    }
    return false;
}
/** Find a transition from a choice pseudo state */
function getChoiceTransition(pseudoState, trigger) {
    var transitions = [];
    for (var i = pseudoState.outgoing.length; i--;) {
        if (pseudoState.outgoing[i].guard(trigger)) {
            transitions.push(pseudoState.outgoing[i]);
        }
    }
    return transitions[util_1.random.get(transitions.length)];
}
function getVertexTransition(vertex, trigger) {
    var result;
    // iterate through all outgoing transitions of this state looking for one whose guard evaluates true
    for (var i = vertex.outgoing.length; i--;) {
        if (vertex.outgoing[i].guard(trigger)) {
            if (result !== undefined) {
                throw new Error("Multiple transitions found at " + vertex + " for " + trigger);
            }
            result = vertex.outgoing[i];
        }
    }
    return result;
}
/**
 * Execute a transition
 * @param transition The transition to traverse
 * @param instance The state machine instance to evaluate the trigger against.
 * @param deepHistory True if deep history semantics are in play.
 * @param trigger The trigger used to evaluate.
 * @returns Returns true if a transition was found and traversed.
 * @internal
 */
function traverse(transition, instance, deepHistory, trigger) {
    var transitions = [transition];
    // gather all transitions to be taversed either side of static conditional branches (junctions)
    while (transition.target instanceof model.PseudoState && transition.target.kind === model.PseudoStateKind.Junction) {
        transitions.unshift(transition = transition.target.getTransition(trigger));
    }
    // traverse all transitions
    for (var i = transitions.length; i--;) {
        transitions[i].execute(instance, deepHistory, trigger);
    }
}
/**
 * Checks for and executes completion transitions
 */
function completion(state, instance, deepHistory, trigger) {
    // check to see if the state is complete; fail fast if its not
    for (var i = state.children.length; i--;) {
        if (instance.getState(state.children[i]).outgoing.length !== 0) {
            return;
        }
    }
    //	log.info(() => `${instance} testing completion transitions at ${this}`, log.Evaluate);
    // find and execute transition
    findAndTraverse(state, instance, deepHistory, trigger);
}
/**
 * Initiate region entry
 */
model.Region.prototype.enterHead = function (instance, deepHistory, trigger) {
    var _this = this;
    util_1.log.info(function () { return instance + " enter " + _this; }, util_1.log.Entry);
};
/**
 * Complete region entry
 */
model.Region.prototype.enterTail = function (instance, deepHistory, trigger) {
    var current;
    var starting = this.starting;
    // determine if history semantics are in play and the region has previously been entered then select the starting vertex accordingly
    if ((deepHistory || (starting && starting.kind & model.History)) && (current = instance.getState(this))) {
        starting = current;
        deepHistory = deepHistory || (this.starting.kind === model.PseudoStateKind.DeepHistory);
    }
    if (!starting) {
        throw new Error(instance + " no initial pseudo state found at " + this);
    }
    // cascade the entry operation to the approriate child vertex
    starting.enterHead(instance, deepHistory, trigger);
    starting.enterTail(instance, deepHistory, trigger);
};
/**
 * Leave a region
 */
model.Region.prototype.leave = function (instance, deepHistory, trigger) {
    var _this = this;
    // cascade the leave operation to the currently active child vertex
    instance.getVertex(this).leave(instance, deepHistory, trigger);
    util_1.log.info(function () { return instance + " leave " + _this; }, util_1.log.Exit);
};
/** Find a transition from the pseudo state for a given trigger event */
model.PseudoState.prototype.getTransition = function (trigger) {
    var result = (this.kind === model.PseudoStateKind.Choice ? getChoiceTransition : getVertexTransition)(this, trigger) || this.elseTransition;
    if (!result) {
        throw new Error("Unable to find transition at " + this + " for " + trigger);
    }
    return result;
};
/**
 * Initiate pseudo state entry
 */
model.PseudoState.prototype.enterHead = function (instance, deepHistory, trigger) {
    var _this = this;
    util_1.log.info(function () { return instance + " enter " + _this; }, util_1.log.Entry);
    // update the current vertex of the parent region
    instance.setVertex(this);
};
/**
 * Complete pseudo state entry
 */
model.PseudoState.prototype.enterTail = function (instance, deepHistory, trigger) {
    // a pseudo state must always have a completion transition (junction pseudo state completion occurs within the traverse method above)
    if (this.kind !== model.PseudoStateKind.Junction) {
        findAndTraverse(this, instance, deepHistory, trigger);
    }
};
/**
 * Leave a pseudo state
 */
model.PseudoState.prototype.leave = function (instance, deepHistory, trigger) {
    var _this = this;
    util_1.log.info(function () { return instance + " leave " + _this; }, util_1.log.Exit);
};
/**
 * Find a single transition from the state for a given trigger event
 */
model.State.prototype.getTransition = function (trigger) {
    return getVertexTransition(this, trigger);
};
/**
 * Initiate state entry
 */
model.State.prototype.enterHead = function (instance, deepHistory, trigger) {
    var _this = this;
    util_1.log.info(function () { return instance + " enter " + _this; }, util_1.log.Entry);
    // update the current state and vertex of the parent region
    instance.setState(this);
    // perform the user defined entry behaviour
    for (var i = this.onEnter.length; i--;) {
        this.onEnter[i](trigger);
    }
};
/**
 * Complete state entry
 */
model.State.prototype.enterTail = function (instance, deepHistory, trigger) {
    // cascade the enter operation to child regions
    for (var i = this.children.length; i--;) {
        this.children[i].enterHead(instance, deepHistory, trigger);
        this.children[i].enterTail(instance, deepHistory, trigger);
    }
    // test for completion transitions
    completion(this, instance, deepHistory, this);
};
/***
 * Leave a state
 */
model.State.prototype.leave = function (instance, deepHistory, trigger) {
    var _this = this;
    // cascade the leave operation to all child regions
    for (var i = this.children.length; i--;) {
        this.children[i].leave(instance, deepHistory, trigger);
    }
    util_1.log.info(function () { return instance + " leave " + _this; }, util_1.log.Exit);
    // perform the user define leave behaviour
    for (i = this.onLeave.length; i--;) {
        this.onLeave[i](trigger);
    }
};
model.ExternalTransition.prototype.execute = model.LocalTransition.prototype.execute = function (instance, deepHistory, trigger) {
    var _this = this;
    util_1.log.info(function () { return "Executing transition from " + _this.source + " to " + _this.target; }, util_1.log.Transition);
    // leave elements below the common ancestor
    this.toLeave.leave(instance, deepHistory, trigger);
    // perform the transition behaviour
    for (var i = this.actions.length; i--;) {
        this.actions[i](trigger);
    }
    // enter elements below the common ancestor to the target
    for (i = this.toEnter.length; i--;) {
        this.toEnter[i].enterHead(instance, deepHistory, trigger);
    }
    // cascade the entry action to any child elements of the target
    this.toEnter[0].enterTail(instance, deepHistory, trigger);
};
/**
 * Traverses an internal transition; calls only the transition behaviour and does not cause a state transition.
 */
model.InternalTransition.prototype.execute = function (instance, deepHistory, trigger) {
    var _this = this;
    util_1.log.info(function () { return "Executing transition at " + _this.target; }, util_1.log.Transition);
    // perform the transition behaviour 
    for (var i = this.actions.length; i--;) {
        this.actions[i](trigger);
    }
    // test for completion transitions as there will be state entry/exit performed where the test is usually performed
    completion(this.source, instance, deepHistory, this.target);
};
