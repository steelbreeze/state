"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var model = __importStar(require("../model"));
var util_1 = require("../util");
/**
 * Passes a trigger event to a state machine instance for evaluation
 * @param state The state to evaluate the trigger event against.
 * @param instance The state machine instance to evaluate the trigger against.
 * @param deepHistory True if deep history semantics are invoked.
 * @param trigger The trigger event
 * @returns Returns true if the trigger caused a state transition.
 * @hidden
 */
function evaluate(state, instance, deepHistory, trigger) {
    var result = delegate(state, instance, deepHistory, trigger) || accept(state, instance, deepHistory, trigger);
    // check completion transitions if the trigger caused as state transition and this state is still active
    if (result && state.parent && instance.getState(state.parent) === state) {
        completion(state, instance, deepHistory, state);
    }
    // if not processed, check to see if we should defer the event for later processing
    if (!result) {
        for (var i = state.deferrableTrigger.length; i--;) {
            if (trigger.constructor === state.deferrableTrigger[i] && instance.eventPool.indexOf(trigger) === -1) {
                util_1.log.info(function () { return instance + " defer " + trigger; }, util_1.log.Evaluate);
                instance.eventPool.push(trigger);
            }
        }
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
/** Accept a trigger and vertex: evaluate the guard conditions of the transitions and traverse if one evaluates true. */
function accept(vertex, instance, deepHistory, trigger) {
    var transition = vertex.getTransition(trigger);
    if (transition) {
        traverse(transition, instance, deepHistory, trigger);
        return true;
    }
    return false;
}
/** Find a transition from any state or pseudo state */
function getTransition(vertex, trigger) {
    var result;
    // iterate through all outgoing transitions of this state looking for a single one whose guard evaluates true
    for (var i = vertex.outgoing.length; i--;) {
        if (vertex.outgoing[i].evaluate(trigger)) {
            util_1.assert.ok(!result, function () { return "Multiple transitions found at " + vertex + " for " + trigger; });
            result = vertex.outgoing[i];
        }
    }
    return result;
}
/** Find a transition from a choice pseudo state */
function getChoiceTransition(pseudoState, trigger) {
    var transitions = [];
    // iterate through all outgoing transitions of this state looking any whose guard evaluates true
    for (var i = pseudoState.outgoing.length; i--;) {
        if (pseudoState.outgoing[i].evaluate(trigger)) {
            transitions.push(pseudoState.outgoing[i]);
        }
    }
    // select a random transition from those that evaluated true
    return transitions[util_1.random.get(transitions.length)];
}
/** Traverse a transition */
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
/** Checks for and executes completion transitions */
function completion(state, instance, deepHistory, trigger) {
    // check to see if the state is complete; fail fast if its not
    for (var i = state.children.length; i--;) {
        if (instance.getState(state.children[i]).outgoing.length !== 0) {
            return;
        }
    }
    // look for transitions
    accept(state, instance, deepHistory, trigger);
}
/** Enter a region, state or pseudo state */
model.Region.prototype.enter = model.State.prototype.enter = model.PseudoState.prototype.enter = function (instance, deepHistory, trigger) {
    this.enterHead(instance, deepHistory, trigger);
    this.enterTail(instance, deepHistory, trigger);
};
/** Initiate region entry */
model.Region.prototype.enterHead = function (instance, deepHistory, trigger) {
    var _this = this;
    util_1.log.info(function () { return instance + " enter " + _this; }, util_1.log.Entry);
};
/** Complete region entry */
model.Region.prototype.enterTail = function (instance, deepHistory, trigger) {
    var _this = this;
    var current;
    var starting = this.starting;
    // determine if history semantics are in play and the region has previously been entered then select the starting vertex accordingly
    if ((deepHistory || (this.starting && this.starting.isHistory())) && (current = instance.getState(this))) {
        starting = current;
        deepHistory = deepHistory || (this.starting.kind === model.PseudoStateKind.DeepHistory);
    }
    util_1.assert.ok(starting, function () { return instance + " no initial pseudo state found at " + _this; });
    // cascade the entry operation to the approriate child vertex
    starting.enter(instance, deepHistory, trigger);
};
/** Leave a region */
model.Region.prototype.leave = function (instance, deepHistory, trigger) {
    var _this = this;
    // cascade the leave operation to the currently active child vertex
    instance.getVertex(this).leave(instance, deepHistory, trigger);
    util_1.log.info(function () { return instance + " leave " + _this; }, util_1.log.Exit);
};
/** Find a transition from the pseudo state for a given trigger event */
model.PseudoState.prototype.getTransition = function (trigger) {
    var _this = this;
    var result = (this.kind === model.PseudoStateKind.Choice ? getChoiceTransition : getTransition)(this, trigger) || this.elseTransition;
    util_1.assert.ok(result, function () { return "Unable to find transition at " + _this + " for " + trigger; });
    return result;
};
/** Initiate pseudo state entry */
model.PseudoState.prototype.enterHead = function (instance, deepHistory, trigger) {
    var _this = this;
    util_1.log.info(function () { return instance + " enter " + _this; }, util_1.log.Entry);
    // update the current vertex of the parent region
    instance.setVertex(this);
};
/** Complete pseudo state entry */
model.PseudoState.prototype.enterTail = function (instance, deepHistory, trigger) {
    // a pseudo state must always have a completion transition (junction pseudo state completion occurs within the traverse method above)
    if (this.kind !== model.PseudoStateKind.Junction) {
        accept(this, instance, deepHistory, trigger);
    }
};
/** Leave a pseudo state */
model.PseudoState.prototype.leave = function (instance, deepHistory, trigger) {
    var _this = this;
    util_1.log.info(function () { return instance + " leave " + _this; }, util_1.log.Exit);
};
/** Find a single transition from the state for a given trigger event */
model.State.prototype.getTransition = function (trigger) {
    return getTransition(this, trigger);
};
/** Initiate state entry */
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
/** Complete state entry */
model.State.prototype.enterTail = function (instance, deepHistory, trigger) {
    // cascade the enter operation to child regions
    for (var i = this.children.length; i--;) {
        this.children[i].enter(instance, deepHistory, trigger);
    }
    // test for completion transitions
    completion(this, instance, deepHistory, this);
};
/** Leave a state */
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
/** Traverse an external or local transition */
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
/** Traverse an internal transition; calls only the transition behaviour and does not cause a state transition */
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
