import { log, random } from '../util';
import * as model from '../model';
import { IInstance } from '../runtime';

/**
 * Initialises a state machine instance to its starting state.
 * @param instance The state machine instance.
 * @public
 */
export function initialise(instance: IInstance): void {
	instance.beginTran();

	// initialise the state machine by entering the root element
	instance.root.enterHead(instance, false, undefined);
	instance.root.enterTail(instance, false, undefined);

	instance.commitTran();
}

/**
 * Passes a trigger event into a state machine for evaluation.
 * @param instance The state machine instance to evaluate the trigger against.
 * @param trigger The trigger to evaluate.
 * @returns Returns true if the trigger caused a state transition.
 * @public
 */
export function evaluate(instance: IInstance, trigger: any): boolean {
	log.info(() => `${instance} evaluate ${typeof trigger} trigger: ${trigger}`, log.Evaluate)

	instance.beginTran();

	const result = instance.root.evaluate(instance, false, trigger);

	instance.commitTran();

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
function traverse(transition: model.Transition, instance: IInstance, deepHistory: boolean, trigger: any ):void {
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

/**
 * Runtime extension methods to the region class.
 */
declare module '../model/Region' {
	interface Region {
		enterHead(instance: IInstance, deepHistory: boolean, trigger: any): void;
		enterTail(instance: IInstance, deepHistory: boolean, trigger: any): void;
		leave(instance: IInstance, deepHistory: boolean, trigger: any): void;
	}
}

/**
 * Initiate region entry
 */
model.Region.prototype.enterHead = function (instance: IInstance, deepHistory: boolean, trigger: any): void {
	log.info(() => `${instance} enter ${this}`, log.Entry);
}

/**
 * Complete region entry
 */
model.Region.prototype.enterTail = function (instance: IInstance, deepHistory: boolean, trigger: any): void {
	let starting: model.State | model.PseudoState | undefined;

	// determine if history semantics are in play and the region has previously been entered then select the starting vertex accordingly
	if ((deepHistory || (this.starting && this.starting.kind & model.History)) && (starting = instance.getState(this))) {
		deepHistory = deepHistory || (this.starting!.kind === model.PseudoStateKind.DeepHistory);
	}

	// if no history semantics are in place, use the initial, deep history or shallow pseudo state as the starting vertex
	else {
		starting = this.starting;
	}

	// cascade the entry operation to the approriate child vertex
	if (starting) {
		starting.enterHead(instance, deepHistory, trigger);
		starting.enterTail(instance, deepHistory, trigger);
	} else {
		throw new Error(`${instance} no initial pseudo state found at ${this}`);
	}
}

/**
 * Leave a region
 */
model.Region.prototype.leave = function (instance: IInstance, deepHistory: boolean, trigger: any): void {
	// cascade the leave operation to the currently active child vertex
	instance.getVertex(this).leave(instance, deepHistory, trigger);

	log.info(() => `${instance} leave ${this}`, log.Exit);
}

/**
 * Runtime extensions to the pseudo state class
 */
declare module '../model/PseudoState' {
	interface PseudoState {
		getTransition(trigger: any): model.Transition;

		enterHead(instance: IInstance, deepHistory: boolean, trigger: any): void;
		enterTail(instance: IInstance, deepHistory: boolean, trigger: any): void;
		leave(instance: IInstance, deepHistory: boolean, trigger: any): void;
	}
}

/** 
 * Find a transition from the pseudo state for a given trigger event
 */
model.PseudoState.prototype.getTransition = function (trigger: any): model.Transition {
	let result: model.Transition | undefined;

	// find a single transition for all pseudo states except choice pseudo states
	if (this.kind !== model.PseudoStateKind.Choice) {
		result = model.State.prototype.getTransition.call(this, trigger);
	}

	// choice pseudo states may have multiple outbound transitions evaluate true in which case a random one is selected
	else {
		const transitions: Array<model.Transition> = [];

		for (let i = this.outgoing.length; i--;) {
			if (this.outgoing[i].guard(trigger)) {
				transitions.push(this.outgoing[i]);
			}
		}

		result = transitions[random.get(transitions.length)];
	}

	// if no transition is found look for an else transition (only defined for junction and choice pseudo states)
	if (!result) {
		result = this.elseTransition;
	}

	if (result) {
		return result;
	}

	throw new Error(`Unable to find transition at ${this} for ${trigger}`);
}

/**
 * Initiate pseudo state entry
 */
model.PseudoState.prototype.enterHead = function (instance: IInstance, deepHistory: boolean, trigger: any): void {
	log.info(() => `${instance} enter ${this}`, log.Entry);

	// update the current vertex of the parent region
	instance.setVertex(this);
}

/**
 * Complete pseudo state entry
 */
model.PseudoState.prototype.enterTail = function (instance: IInstance, deepHistory: boolean, trigger: any): void {
	// a pseudo state must always have a completion transition (junction pseudo state completion occurs within the traverse method above)
	if (this.kind !== model.PseudoStateKind.Junction) {
//		log.info(() => `${instance} testing completion transitions from ${this}`, log.Evaluate);

		const transition = this.getTransition(trigger);

		if(transition) {
			traverse(transition, instance, deepHistory, trigger);
		}
	}
}

/**
 * Leave a pseudo state
 */
model.PseudoState.prototype.leave = function (instance: IInstance, deepHistory: boolean, trigger: any): void {
	log.info(() => `${instance} leave ${this}`, log.Exit);
}

/**
 * Runtime extension methods to the state class.
 */
declare module '../model/State' {
	interface State {
		evaluate(instance: IInstance, deepHistory: boolean, trigger: any): boolean;

		getTransition(trigger: any): model.Transition | undefined;

		completion(instance: IInstance, deepHistory: boolean, trigger: any): void;

		enterHead(instance: IInstance, deepHistory: boolean, trigger: any): void;
		enterTail(instance: IInstance, deepHistory: boolean, trigger: any): void;
		leave(instance: IInstance, deepHistory: boolean, trigger: any): void;
	}
}

/**
 * Passes a trigger event to a state for evaluation
 */
model.State.prototype.evaluate = function (instance: IInstance, deepHistory: boolean, trigger: any): boolean {
	let result: boolean = false;

	// delegate to child states to facilitate depth-first evaluation
	for (let i = this.children.length; i--;) {
		if (instance.getState(this.children[i]).evaluate(instance, deepHistory, trigger)) {
			result = true;

			// if a transition in a child state causes us to exit this state, break out now
			if (this.parent && instance.getState(this.parent) !== this) {
				return result;
			}
		}
	}

	// test for completion transition if the event caused a state transition in a child state
	if (result) {
		this.completion(instance, deepHistory, this);
	}
	
	// if no state transition occured in a child state look for transitions from this state
	else {
		const transition = this.getTransition(trigger);

		if(transition) {
			traverse(transition, instance, deepHistory, trigger);

			result = true;
		}
	}

	return result;
}

/**
 * Checks for and executes completion transitions
 */
model.State.prototype.completion = function (instance: IInstance, deepHistory: boolean, trigger: any): void {
	// check to see if the state is complete; fail fast if its not
	for (let i = this.children.length; i--;) {
		if (instance.getState(this.children[i]).outgoing.length !== 0) {
			return;
		}
	}

//	log.info(() => `${instance} testing completion transitions at ${this}`, log.Evaluate);

	// find and execute transition
	const transition = this.getTransition(trigger);

	if(transition) {
		traverse(transition, instance, deepHistory, trigger);
	}
}

/** 
 * Find a transition from the state for a given trigger event
 */
model.State.prototype.getTransition = function (trigger: any): model.Transition | undefined {
	let result: model.Transition | undefined;

	for (let i = this.outgoing.length; i--;) {
		if (this.outgoing[i].guard(trigger)) {
			if (result) {
				throw new Error(`Multiple transitions found at ${this} for ${trigger}`);
			}

			result = this.outgoing[i];
		}
	}

	return result;
}

/**
 * Initiate state entry
 */
model.State.prototype.enterHead = function (instance: IInstance, deepHistory: boolean, trigger: any): void {
	log.info(() => `${instance} enter ${this}`, log.Entry);

	// update the current state and vertex of the parent region
	instance.setState(this);

	// perform the user defined entry behaviour
	for (let i = this.onEnter.length; i--;) {
		this.onEnter[i](trigger);
	}
}

/**
 * Complete state entry
 */
model.State.prototype.enterTail = function (instance: IInstance, deepHistory: boolean, trigger: any): void {
	// cascade the enter operation to child regions
	for (let i = this.children.length; i--;) {
		this.children[i].enterHead(instance, deepHistory, trigger);
		this.children[i].enterTail(instance, deepHistory, trigger);
	}

	// test for completion transitions
	this.completion(instance, deepHistory, this);
}

/***
 * Leave a state
 */
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
 * Runtime extension methods to the transition base class.
 */
declare module '../model/Transition' {
	interface Transition<TTrigger> {
		execute(instance: IInstance, deepHistory: boolean, trigger: any): void;
	}
}

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

/**
 * Traverses an internal transition; calls only the transition behaviour and does not cause a state transition.
 */
model.InternalTransition.prototype.execute = function (instance: IInstance, deepHistory: boolean, trigger: any): void {
	log.info(() => `Executing transition at ${this.target}`, log.Transition);

	// perform the transition behaviour 
	for (let i = this.actions.length; i--;) {
		this.actions[i](trigger);
	}

	// test for completion transitions as there will be state entry/exit performed where the test is usually performed
	this.source.completion(instance, deepHistory, this.target);
}