import { log, PseudoStateKind, TransitionKind, Vertex, PseudoState } from '.';
import { Transaction } from './Transaction';
import { TransitionStrategy } from './TransitionStrategy';
import { ExternalTransitionStrategy } from './ExternalTransitionStrategy';
import { InternalTransitionStrategy } from './InternalTransitionStrategy';
import { LocalTransitionStrategy } from './LocalTransitionStrategy';
import { types } from './types';

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
	 * The optional event type that will cause this transition to be traversed.
	 * @internal
	 * @hidden
	 */
	private eventType: types.Constructor<TTrigger> | undefined;

	/**
	 * The optional guard condition that can further restrict the transition being traversed.
	 * @internal
	 * @hidden
	 */
	private guard: types.Predicate<TTrigger> = () => true;

	/**
	 * The user defined actions that will be called on transition traversal.
	 * @internal
	 * @hidden
	 */
	private traverseActions: Array<types.Behaviour<TTrigger>> = [];

	/**
	 * The precise semantics of the transition traversal based on the transition type.
	 * @internal
	 * @hidden
	 */
	private strategy: TransitionStrategy;

	/**
	 * Creates a new instance of the Transition class. By defaily, this is an internal transition.
	 * @param source The source vertex of the transition.
	 * @internal
	 * @hidden
	 */
	constructor(public readonly source: Vertex) {
		this.target = source;
		this.strategy = new InternalTransitionStrategy(this.source, this.target);

		this.source.outgoing.push(this);
	}

	/**
	 * Adds an event type constraint to the transition; it will only be traversed if a trigger event of this type is evaluated.
	 * @param eventType The type of trigger event that will cause this transition to be traversed.
	 * @return Returns the transitions thereby allowing a fluent style transition construction.
	 */
	on(eventType: types.Constructor<TTrigger>): this {
		this.eventType = eventType;

		return this;
	}

	/**
	 * Adds an guard condition to the transition; it will only be traversed if the guard condition evaluates true for a given trigger event.
	 * @param guard A boolean predicate callback that takes the trigger event as a parameter.
	 * @return Returns the transitions thereby allowing a fluent style transition construction.
	 * @remarks It is recommended that this is used in conjunction with the on method, which will first test the type of the trigger event.
	 */
	when(guard: types.Predicate<TTrigger>): this {
		this.guard = guard;

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

		if(kind === TransitionKind.External) {
			this.strategy = new ExternalTransitionStrategy(this.source, this.target);
		} else {
			this.strategy = new LocalTransitionStrategy(this.source, this.target);
		}

		return this;
	}

	/**
	 * Adds user-defined behaviour to the transition that will be called after the source vertex has been exited and before the target vertex is entered.
	 * @param actions The action, or actions to call with the trigger event as a parameter.
	 * @return Returns the transitions thereby allowing a fluent style transition construction.
	 */
	effect(...actions: Array<types.Behaviour<TTrigger>>): this {
		this.traverseActions.push(...actions);

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
		return (this.eventType === undefined || trigger.constructor === this.eventType) && this.guard(trigger);
	}

	/**
	 * Traverses a composite transition.
	 * @param transaction The current transaction being executed.
	 * @param history True if deep history semantics are in play.
	 * @param trigger The trigger event.
	 * @internal
	 * @hidden
	 */
	traverse(transaction: Transaction, history: boolean, trigger: any): void {
		var transition: Transition = this;
		const transitions: Array<Transition> = [transition];

		while (transition.target instanceof PseudoState && transition.target.kind === PseudoStateKind.Junction) {
			transitions.push(transition = transition.target.getTransition(trigger)!);
		}

		transitions.forEach(t => t.execute(transaction, history, trigger));
	}

	/**
	 * Traverses an individual transition.
	 * @param transaction The current transaction being executed.
	 * @param history True if deep history semantics are in play.
	 * @param trigger The trigger event.
	 * @internal
	 * @hidden
	 */
	execute(transaction: Transaction, history: boolean, trigger: any): void {
		log.write(() => `${transaction.instance} traverse ${this}`, log.Transition);

		this.strategy.doExitSource(transaction, history, trigger);

		this.traverseActions.forEach(action => action(trigger, transaction.instance));

		this.strategy.doEnterTarget(transaction, history, trigger);
	}

	/**
	 * Returns the transition in string form.
	 */
	public toString(): string {
		return `${this.strategy} transition from ${this.source} to ${this.target}`;
	}
}
