import { Behaviour, Constructor, Predicate } from './types';
import { log, PseudoStateKind, TransitionKind, Region, Vertex, PseudoState, State } from '.';
import { Transaction } from './Transaction';

/**
 * Type of the transition strategy
 * @hidden
 */
type TransitionStrategy<TTrigger> = (transaction: Transaction, deepHistory: boolean, trigger: any, transition: Transition<TTrigger>) => void;

/**
 * A transition changes the active state configuration of a state machine by specifying the valid transitions between states and the trigger events that cause them to be traversed.
 * @param TTrigger The type of trigger event that this transition will respond to.
 */
export class Transition<TTrigger = any> {
	/**
	 * The target vertex of the transition.
	 */
	public target: Vertex;

	/**
	 * The optional guard condition that can restrict the transision being traversed based on trigger event type.
	 * @internal
	 * @hidden
	 */
	private typeGuard: Predicate<TTrigger> = () => true;

	/**
	 * The optional guard condition that can  restrict the transition being traversed based on user logic.
	 * @internal
	 * @hidden
	 */
	private userGuard: Predicate<TTrigger> = () => true;

	/**
	 * The user defined actions that will be called on transition traversal.
	 * @internal
	 * @hidden
	 */
	actions: Array<Behaviour<TTrigger>> = [];

	/**
	 * The precise semantics of the transition traversal based on the transition type.
	 * @internal
	 * @hidden
	 */
	private execute: TransitionStrategy<TTrigger>;

	/**
	 * Creates a new instance of the Transition class. By defaily, this is an internal transition.
	 * @param source The source vertex of the transition.
	 * @internal
	 * @hidden
	 */
	constructor(public readonly source: Vertex) {
		this.target = source;
		this.execute = internalTransition;

		this.source.outgoing.push(this);
	}

	/**
	 * Adds an event type constraint to the transition; it will only be traversed if a trigger event of this type is evaluated.
	 * @param eventType The type of trigger event that will cause this transition to be traversed.
	 * @return Returns the transitions thereby allowing a fluent style transition construction.
	 */
	on(eventType: Constructor<TTrigger>): this {
		this.typeGuard = (trigger: any) => trigger.constructor === eventType;

		return this;
	}

	/**
	 * Adds an guard condition to the transition; it will only be traversed if the guard condition evaluates true for a given trigger event.
	 * @param guard A boolean predicate callback that takes the trigger event as a parameter.
	 * @return Returns the transitions thereby allowing a fluent style transition construction.
	 * @remarks It is recommended that this is used in conjunction with the on method, which will first test the type of the trigger event.
	 */
	when(guard: Predicate<TTrigger>): this {
		this.userGuard = guard;

		return this;
	}

	/**
	 * Specifies a target vertex of the transition and the semantics of the transition.
	 * @param target The target vertex of the transition.
	 * @param kind The kind of transition, defining the precise semantics of how the transition will impact the active state configuration.
	 * @return Returns the transitions thereby allowing a fluent style transition construction.
	 */
	to(target: Vertex, kind: TransitionKind = TransitionKind.External): this {
		this.target = target;

		if (kind === TransitionKind.External) {
			this.execute = externalTransition<TTrigger>(this.source, this.target);
		} else {
			this.execute = localTransition;
		}

		return this;
	}

	/**
	 * Adds user-defined behaviour to the transition that will be called after the source vertex has been exited and before the target vertex is entered.
	 * @param actions The action, or actions to call with the trigger event as a parameter.
	 * @return Returns the transitions thereby allowing a fluent style transition construction.
	 */
	effect(...actions: Array<Behaviour<TTrigger>>): this {
		this.actions.push(...actions);

		return this;
	}

	/**
	 * Tests the trigger event against both the event type constraint and guard condition if specified.
	 * @param trigger The trigger event.
	 * @returns Returns true if the trigger event was of the event type and the guard condition passed if specified.
	 * @internal
	 * @hidden
	 */
	evaluate(trigger: any): boolean {
		return this.typeGuard(trigger) && this.userGuard(trigger);
	}

	/**
	 * Traverses a transition.
	 * @param transaction The current transaction being executed.
	 * @param deepHistory True if deep history semantics are in play.
	 * @param trigger The trigger event.
	 * @internal
	 * @hidden
	 */
	traverse(transaction: Transaction, deepHistory: boolean, trigger: any): void {
		var transition: Transition = this;
		
		// initilise the composite with the initial transition
		const transitions: Array<Transition> = [transition];

		// For junction pseudo states, we must follow the transitions prior to traversing them
		while (transition.target instanceof PseudoState && transition.target.kind & PseudoStateKind.Junction) {
			transitions.push(transition = transition.target.getTransition(trigger)!);
		}

		// execute the transition strategy for each transition in composite
		transitions.forEach(t => t.execute(transaction, deepHistory, trigger, t));
	}
}

/**
 * Internal transitions just execute the transition actions and then test for completion.
 * @hidden
 */
function internalTransition<TTrigger>(transaction: Transaction, deepHistory: boolean, trigger: any, transition: Transition<TTrigger>): void {
	log.write(() => `${transaction.instance} traverse internal transition at ${transition.target}`, log.Transition);

	transition.actions.forEach(action => action(trigger, transaction.instance));

	if (transition.target instanceof State) {
		transition.target.completion(transaction, deepHistory);
	}
}

/**
 * Local transitions find must find the most common inactive vertex in the target ancestry, then exit its active sibling and enter the inactive vertex.
 * @hidden
 */
function localTransition<TTrigger>(transaction: Transaction, deepHistory: boolean, trigger: any, transition: Transition<TTrigger>): void {
	log.write(() => `${transaction.instance} traverse local transition to ${transition.target}`, log.Transition);

	// Find the first inactive vertex abode the target
	const vertexToEnter = toEnter(transaction, transition.target);

	// exit the active sibling of the vertex to enter
	if (!vertexToEnter.isActive(transaction) && vertexToEnter.parent) {
		const vertex = transaction.getVertex(vertexToEnter.parent);

		if (vertex) {
			vertex.doExit(transaction, deepHistory, trigger);
		}
	}

	transition.actions.forEach(action => action(trigger, transaction.instance));

	if (vertexToEnter && !vertexToEnter.isActive(transaction)) {
		vertexToEnter.doEnter(transaction, deepHistory, trigger);
	}
}

/**
 * External transitions find the least common ancester between source and target, then exit the element below it on the source side and enter the sibling on the target side.
 * @hidden
 */
function externalTransition<TTrigger>(source: Vertex, target: Vertex): TransitionStrategy<TTrigger> {
	let toExit: Region | Vertex | undefined;
	let toEnter: Array<Region | Vertex> = [];

	// create iterators over the source and target vertex ancestry
	const sourceIterator = ancestry(source);
	const targetIterator = ancestry(target);

	// get the first result from each iterator (this will always be the state machine root element)
	let sourceResult = sourceIterator.next();
	let targetResult = targetIterator.next();

	// iterate through all the common ancestors
	do {
		// set the actual source/target elements
		toExit = sourceResult.value;
		toEnter = [targetResult.value];

		sourceResult = sourceIterator.next();
		targetResult = targetIterator.next();
	} while (toExit === toEnter[0] && !sourceResult.done && !targetResult.done);

	// all elements past the common ancestor on the target side must be entered
	while (!targetResult.done) {
		toEnter.push(targetResult.value);

		targetResult = targetIterator.next();
	}

	// if the target is a history pseudo state, remove it (as normal history behaviour its the parent region is required)
	if (target instanceof PseudoState && target.kind & PseudoStateKind.History) {
		toEnter.pop();
	}

	return (transaction: Transaction, deepHistory: boolean, trigger: any, transition: Transition<TTrigger>): void => {
		log.write(() => `${transaction.instance} traverse external transition from ${source} to ${target}`, log.Transition);

		toExit!.doExit(transaction, deepHistory, trigger);

		transition.actions.forEach(action => action(trigger, transaction.instance));

		// enter, but do not cascade entry all elements from below the common ancestor to the target
		toEnter.forEach((element, index) => element.doEnterHead(transaction, deepHistory, trigger, toEnter[index + 1]));

		// cascade entry from the target onwards
		toEnter[toEnter.length - 1].doEnterTail(transaction, deepHistory, trigger);
	}
}

/**
* Returns the ancestry of this element from the root element of the hierarchy to this element.
* @returns Returns an iterable iterator used to process the ancestors.
* @internal
* @hidden
*/
function* ancestry(element: Region | Vertex): IterableIterator<Region | Vertex> {
	if (element.parent) {
		yield* ancestry(element.parent);
	}

	yield element;
}

/**
 * Determines the vertex that will need to be entered; the first non-active vertex in the ancestry above the target vertex.
 * @param transaction 
 * @param vertex 
 * @returns 
 * @hidden
 */
function toEnter(transaction: Transaction, vertex: Vertex): Vertex {
	while (vertex.parent && vertex.parent.parent && !vertex.parent.parent.isActive(transaction)) {
		vertex = vertex.parent.parent;
	}

	return vertex;
}
