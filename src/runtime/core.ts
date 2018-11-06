import * as model from '../model';
import { assert, log, random } from '../util';
import { IInstance } from '../runtime';

/**
 * Passes a trigger event to a state machine instance for evaluation
 * @param state The state to evaluate the trigger event against.
 * @param instance The state machine instance to evaluate the trigger against.
 * @param deepHistory True if deep history semantics are invoked.
 * @param trigger The trigger event
 * @returns Returns true if the trigger caused a state transition.
 */
export function evaluate(state: model.State, instance: IInstance, deepHistory: boolean, trigger: any): boolean {
	const result = delegate(state, instance, deepHistory, trigger) || accept(state, instance, deepHistory, trigger);

	// check completion transitions if the trigger caused as state transition and this state is still active
	if (result && state.parent && instance.getState(state.parent) === state) {
		completion(state, instance, deepHistory, state);
	}

	return result;
}

/** Delegate a trigger to children for evaluation */
function delegate(state: model.State, instance: IInstance, deepHistory: boolean, trigger: any): boolean {
	let result: boolean = false;

	// delegate to the current state of child regions for evaluation
	for (let i = state.children.length; i--;) {
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
function accept(vertex: model.State | model.PseudoState, instance: IInstance, deepHistory: boolean, trigger: any): boolean {
	const transition = vertex.getTransition(trigger);

	if (transition) {
		traverse(transition, instance, deepHistory, trigger);

		return true;
	}

	return false;
}

/** Find a transition from any state or pseudo state */
function getTransition(vertex: model.State | model.PseudoState, trigger: any): model.Transition | undefined {
	let result: model.Transition | undefined;

	// iterate through all outgoing transitions of this state looking for a single one whose guard evaluates true
	for (let i = vertex.outgoing.length; i--;) {
		if (vertex.outgoing[i].guard(trigger)) {
			assert.undefined(result, () => `Multiple transitions found at ${vertex} for ${trigger}`);

			result = vertex.outgoing[i];
		}
	}

	return result;
}

/** Find a transition from a choice pseudo state */
function getChoiceTransition(pseudoState: model.PseudoState, trigger: any): model.Transition | undefined {
	let transitions: Array<model.Transition> = [];

	// iterate through all outgoing transitions of this state looking any whose guard evaluates true
	for (let i = pseudoState.outgoing.length; i--;) {
		if (pseudoState.outgoing[i].guard(trigger)) {
			transitions.push(pseudoState.outgoing[i]);
		}
	}

	// select a random transition from those that evaluated true
	return transitions[random.get(transitions.length)];
}

/** Traverse a transition */
function traverse(transition: model.Transition, instance: IInstance, deepHistory: boolean, trigger: any): void {
	const transitions: Array<model.Transition> = [transition];

	// gather all transitions to be taversed either side of static conditional branches (junctions)
	while (transition.target instanceof model.PseudoState && transition.target.kind === model.PseudoStateKind.Junction) {
		transitions.unshift(transition = transition.target.getTransition(trigger));
	}
	// traverse all transitions
	for (let i = transitions.length; i--;) {
		transitions[i].execute(instance, deepHistory, trigger);
	}
}

/** Checks for and executes completion transitions */
function completion(state: model.State, instance: IInstance, deepHistory: boolean, trigger: any): void {
	// check to see if the state is complete; fail fast if its not
	for (let i = state.children.length; i--;) {
		if (instance.getState(state.children[i]).outgoing.length !== 0) {
			return;
		}
	}

	// look for transitions
	accept(state, instance, deepHistory, trigger);
}

/**
 * Runtime extension methods to the region class.
 * @internal
 */ 
declare module '../model/Region' {
	interface Region {
		enter(instance: IInstance, deepHistory: boolean, trigger: any): void;
		enterHead(instance: IInstance, deepHistory: boolean, trigger: any): void;
		enterTail(instance: IInstance, deepHistory: boolean, trigger: any): void;
		leave(instance: IInstance, deepHistory: boolean, trigger: any): void;
	}
}

/** Enter a region */
model.Region.prototype.enter = function (instance: IInstance, deepHistory: boolean, trigger: any): void {
	this.enterHead(instance, deepHistory, trigger);
	this.enterTail(instance, deepHistory, trigger);
}

/** Initiate region entry */
model.Region.prototype.enterHead = function (instance: IInstance, deepHistory: boolean, trigger: any): void {
	log.info(() => `${instance} enter ${this}`, log.Entry);
}

/** Complete region entry */
model.Region.prototype.enterTail = function (instance: IInstance, deepHistory: boolean, trigger: any): void {
	let current: model.State | undefined;
	let starting: model.State | model.PseudoState | undefined = this.starting;

	// determine if history semantics are in play and the region has previously been entered then select the starting vertex accordingly
	if ((deepHistory || (starting && starting.isHistory())) && (current = instance.getState(this))) {
		starting = current;
		deepHistory = deepHistory || (this.starting!.kind === model.PseudoStateKind.DeepHistory);
	}

	assert.defined(starting, () => `${instance} no initial pseudo state found at ${this}`);

	// cascade the entry operation to the approriate child vertex
	starting!.enter(instance, deepHistory, trigger);
}

/** Leave a region */
model.Region.prototype.leave = function (instance: IInstance, deepHistory: boolean, trigger: any): void {
	// cascade the leave operation to the currently active child vertex
	instance.getVertex(this).leave(instance, deepHistory, trigger);

	log.info(() => `${instance} leave ${this}`, log.Exit);
}

/**
 * Runtime extension methods to the pseudo state class.
 * @internal
 */ 
declare module '../model/PseudoState' {
	interface PseudoState {
		getTransition(trigger: any): model.Transition;

		enter(instance: IInstance, deepHistory: boolean, trigger: any): void;
		enterHead(instance: IInstance, deepHistory: boolean, trigger: any): void;
		enterTail(instance: IInstance, deepHistory: boolean, trigger: any): void;
		leave(instance: IInstance, deepHistory: boolean, trigger: any): void;
	}
}

/** Find a transition from the pseudo state for a given trigger event */
model.PseudoState.prototype.getTransition = function (trigger: any): model.Transition {
	const result = (this.kind === model.PseudoStateKind.Choice ? getChoiceTransition : getTransition)(this, trigger) || this.elseTransition;

	assert.defined(result, () => `Unable to find transition at ${this} for ${trigger}`);

	return result!;
}

/** Enter a pseudo state */
model.PseudoState.prototype.enter = function (instance: IInstance, deepHistory: boolean, trigger: any): void {
	this.enterHead(instance, deepHistory, trigger);
	this.enterTail(instance, deepHistory, trigger);
}

/** Initiate pseudo state entry */
model.PseudoState.prototype.enterHead = function (instance: IInstance, deepHistory: boolean, trigger: any): void {
	log.info(() => `${instance} enter ${this}`, log.Entry);

	// update the current vertex of the parent region
	instance.setVertex(this);
}

/** Complete pseudo state entry */
model.PseudoState.prototype.enterTail = function (instance: IInstance, deepHistory: boolean, trigger: any): void {
	// a pseudo state must always have a completion transition (junction pseudo state completion occurs within the traverse method above)
	if (this.kind !== model.PseudoStateKind.Junction) {
		accept(this, instance, deepHistory, trigger);
	}
}

/** Leave a pseudo state */
model.PseudoState.prototype.leave = function (instance: IInstance, deepHistory: boolean, trigger: any): void {
	log.info(() => `${instance} leave ${this}`, log.Exit);
}

/**
 * Runtime extension methods to the state class.
 * @internal
 */ 
declare module '../model/State' {
	interface State {
		getTransition(trigger: any): model.Transition | undefined;

		enter(instance: IInstance, deepHistory: boolean, trigger: any): void;
		enterHead(instance: IInstance, deepHistory: boolean, trigger: any): void;
		enterTail(instance: IInstance, deepHistory: boolean, trigger: any): void;
		leave(instance: IInstance, deepHistory: boolean, trigger: any): void;
	}
}

/** Find a single transition from the state for a given trigger event */
model.State.prototype.getTransition = function (trigger: any): model.Transition | undefined {
	return getTransition(this, trigger);
}

/** Enter a state */
model.State.prototype.enter = function (instance: IInstance, deepHistory: boolean, trigger: any): void {
	this.enterHead(instance, deepHistory, trigger);
	this.enterTail(instance, deepHistory, trigger);
}

/** Initiate state entry */
model.State.prototype.enterHead = function (instance: IInstance, deepHistory: boolean, trigger: any): void {
	log.info(() => `${instance} enter ${this}`, log.Entry);

	// update the current state and vertex of the parent region
	instance.setState(this);

	// perform the user defined entry behaviour
	for (let i = this.onEnter.length; i--;) {
		this.onEnter[i](trigger);
	}
}

/** Complete state entry */
model.State.prototype.enterTail = function (instance: IInstance, deepHistory: boolean, trigger: any): void {
	// cascade the enter operation to child regions
	for (let i = this.children.length; i--;) {
		this.children[i].enter(instance, deepHistory, trigger);
	}

	// test for completion transitions
	completion(this, instance, deepHistory, this);
}

/** Leave a state */
model.State.prototype.leave = function (instance: IInstance, deepHistory: boolean, trigger: any): void {
	// cascade the leave operation to all child regions
	for (var i = this.children.length; i--;) {
		this.children[i].leave(instance, deepHistory, trigger);
	}

	log.info(() => `${instance} leave ${this}`, log.Exit);

	// perform the user define leave behaviour
	for (i = this.onLeave.length; i--;) {
		this.onLeave[i](trigger);
	}
}

/**
 * Runtime extension methods to the transition class.
 * @internal
 */ 
declare module '../model/Transition' {
	interface Transition<TTrigger> {
		execute(instance: IInstance, deepHistory: boolean, trigger: any): void;
	}
}

/** Traverse an external or local transition */
model.ExternalTransition.prototype.execute = model.LocalTransition.prototype.execute = function (instance: IInstance, deepHistory: boolean, trigger: any): void {
	log.info(() => `Executing transition from ${this.source} to ${this.target}`, log.Transition);

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
}

/** Traverse an internal transition; calls only the transition behaviour and does not cause a state transition */
model.InternalTransition.prototype.execute = function (instance: IInstance, deepHistory: boolean, trigger: any): void {
	log.info(() => `Executing transition at ${this.target}`, log.Transition);

	// perform the transition behaviour 
	for (let i = this.actions.length; i--;) {
		this.actions[i](trigger);
	}

	// test for completion transitions as there will be state entry/exit performed where the test is usually performed
	completion(this.source, instance, deepHistory, this.target);
}