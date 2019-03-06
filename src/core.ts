import { assert, log } from './util';

import { PseudoStateKind } from './PseudoStateKind';

import { NamedElement } from './NamedElement';
import { Vertex } from './Vertex';

import { State } from './State';
import { PseudoState } from './PseudoState';
import { Region } from './Region';

import { IInstance } from './IInstance';

/**
 * Passes a trigger event to a state machine instance for evaluation
 * @param state The state to evaluate the trigger event against.
 * @param instance The state machine instance to evaluate the trigger against.
 * @param deepHistory True if deep history semantics are invoked.
 * @param trigger The trigger event
 * @returns Returns true if the trigger was consumed by the state.
 * @hidden
 */
export function evaluate(state: State, instance: IInstance, deepHistory: boolean, trigger: any): boolean {
	const result = delegate(state, instance, deepHistory, trigger) || accept(state, instance, deepHistory, trigger) || doDefer(state, instance, trigger);

	// check completion transitions if the trigger caused as state transition and this state is still active
	if (result && state.parent && instance.getState(state.parent) === state) {
		completion(state, instance, deepHistory, state);
	}

	return result;
}

/** Delegate a trigger to children for evaluation */
export function delegate(state: State, instance: IInstance, deepHistory: boolean, trigger: any): boolean {
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
export function accept(vertex: Vertex, instance: IInstance, deepHistory: boolean, trigger: any): boolean {
	let result = false;

	const transition = vertex.getTransition(trigger);

	if (transition) {
		transition.traverse(instance, deepHistory, trigger);

		result = true;
	}

	return result;
}

/** Evaluates the trigger event against the list of deferred transitions and defers into the event pool if necessary. */
export function doDefer(state: State, instance: IInstance, trigger: any): boolean {
	let result = false;

	if (state.deferrableTrigger.indexOf(trigger.constructor) !== -1) {
		instance.defer(state, trigger);

		result = true;
	}

	return result;
}

/** Checks for and executes completion transitions */
export function completion(state: State, instance: IInstance, deepHistory: boolean, trigger: any): void {
	// check to see if the state is complete; fail fast if its not
	for (let i = state.children.length; i--;) {
		if (!instance.getState(state.children[i]).isFinal()) {
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
declare module './Region' {
	interface Region {
		enter(instance: IInstance, deepHistory: boolean, trigger: any): void;
		enterHead(instance: IInstance, deepHistory: boolean, trigger: any, nextElement: NamedElement | undefined): void;
		enterTail(instance: IInstance, deepHistory: boolean, trigger: any): void;
		leave(instance: IInstance, deepHistory: boolean, trigger: any): void;
	}
}

/**
 * Runtime extension methods to the pseudo state class.
 * @internal
 */
declare module './PseudoState' {
	interface PseudoState {
		enterHead(instance: IInstance, deepHistory: boolean, trigger: any, nextElement: NamedElement | undefined): void;
		enterTail(instance: IInstance, deepHistory: boolean, trigger: any): void;
		leave(instance: IInstance, deepHistory: boolean, trigger: any): void;
	}
}

/** Initiate pseudo state entry */
PseudoState.prototype.enterHead = function (instance: IInstance, deepHistory: boolean, trigger: any, nextElement: NamedElement | undefined): void {
	log.info(() => `${instance} enter ${this}`, log.Entry);

	// update the current vertex of the parent region
	instance.setVertex(this);
}

/** Complete pseudo state entry */
PseudoState.prototype.enterTail = function (instance: IInstance, deepHistory: boolean, trigger: any): void {
	// a pseudo state must always have a completion transition (junction pseudo state completion occurs within the traverse method above)
	if (this.kind !== PseudoStateKind.Junction) {
		accept(this, instance, deepHistory, trigger);
	}
}

/** Leave a pseudo state */
PseudoState.prototype.leave = function (instance: IInstance, deepHistory: boolean, trigger: any): void {
	log.info(() => `${instance} leave ${this}`, log.Exit);
}

/**
 * Runtime extension methods to the state class.
 * @internal
 */
declare module './State' {
	interface State {
		enterHead(instance: IInstance, deepHistory: boolean, trigger: any, nextElement: NamedElement | undefined): void;
		enterTail(instance: IInstance, deepHistory: boolean, trigger: any): void;
		leave(instance: IInstance, deepHistory: boolean, trigger: any): void;
	}
}

/** Initiate state entry */
State.prototype.enterHead = function (instance: IInstance, deepHistory: boolean, trigger: any, nextElement: NamedElement | undefined): void {
	// when entering a state indirectly (part of the target ancestry in a transition that crosses region boundaries), ensure all child regions are entered
	if (nextElement) {
		// enter all child regions except for the next in the ancestry
		for (let i = this.children.length; i--;) {
			if (this.children[i] !== nextElement) {
				this.children[i].enter(instance, deepHistory, trigger);
			}
		}
	}

	log.info(() => `${instance} enter ${this}`, log.Entry);

	// update the current state and vertex of the parent region
	instance.setState(this);

	// perform the user defined entry behaviour
	for (let i = this.onEnter.length; i--;) {
		this.onEnter[i](trigger);
	}
}

/** Complete state entry */
State.prototype.enterTail = function (instance: IInstance, deepHistory: boolean, trigger: any): void {
	// cascade the enter operation to child regions
	for (let i = this.children.length; i--;) {
		this.children[i].enter(instance, deepHistory, trigger);
	}

	// test for completion transitions
	completion(this, instance, deepHistory, this);
}

/** Leave a state */
State.prototype.leave = function (instance: IInstance, deepHistory: boolean, trigger: any): void {
	// cascade the leave operation to all child regions
	for (var i = this.children.length; i--;) {
		this.children[i].leave(instance, deepHistory, trigger);
	}

	log.info(() => `${instance} leave ${this}`, log.Exit);

	// perform the user defined leave behaviour
	for (let i = this.onLeave.length; i--;) {
		this.onLeave[i](trigger);
	}
}
