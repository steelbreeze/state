import { TransitionKind, NamedElement, Region, Transition, Visitor } from '.';
import { Transaction } from './Transaction';
import { types } from './types';

/**
 * Represents an element within a state machine model hierarchy that can be the source or target of a transition.
 * Vertices are contained within regions.
 */
export abstract class Vertex extends NamedElement {
	/** The parent region of the vertex. */
	abstract parent: Region | undefined;

	/**
	 * The transitions originating from this vertex.
	 * @internal
	 * @hidden
	 */
	readonly outgoing: Array<Transition> = [];

	/**
	 * Creates a new instance of the vertex class.
	 * @param name The name of the vertex.
	 * @param parent The parent region of this vertex.
	 */
	protected constructor(name: string, parent: Region | undefined) {
		super(name, parent);

		if (parent) {
			parent.children.push(this);
		}
	}

	/**
	 * Creates a new transition at this vertex triggered by an event of a specific type.
	 * @param TTrigger The type of the triggering event; note that this can be derived from the type parameter.
	 * @param type The type (class name) of the triggering event.
	 * @returns Returns a new typed transition. A typed transition being one whose guard condition and behaviour will accept a parameter of the same type specified.
	 */
	public on<TTrigger>(type: types.Constructor<TTrigger>): Transition<TTrigger> {
		return new Transition<TTrigger>(this).on(type);
	}

	/**
	 * Creates a new transition at this vertex with a guard condition.
	 * @param TTrigger The type of the triggering event.
	 * @param guard The guard condition to determine if the transition should be traversed.
	 * @returns Returns a new transition; if TTrigger is specified, a typed transition will be returned.
	 */
	public when<TTrigger = any>(guard: types.Predicate<TTrigger>): Transition<TTrigger> {
		return new Transition<TTrigger>(this).when(guard);
	}

	/**
	 * Creates a new transition from this vertex to the target vertex.
	 * @param TTrigger The type of the triggering event that the guard will evaluate.
	 * @param target The target of the transition.
	 * @param kind The kind of the transition, specifying its behaviour.
	 * @returns Returns a new transition; if TTrigger is specified, a typed transition will be returned.
	 */
	public to<TTrigger = any>(target: Vertex, kind: TransitionKind = TransitionKind.External): Transition<any> {
		if(kind === TransitionKind.Internal && target !== this) {
			throw new Error( `Internal transitions must have the same source and target states.`);
		}

		return new Transition<TTrigger>(this).to(target, kind);
	}

	/**
	 * Tests the vertex to see if it part of the the active state configuration of a particular state machine instance.
	 * @param transaction The current transaction being executed.
	 * @returns Returns true if this vertex is active in the specified instance.
	 * @internal
	 * @hidden
	 */
	 isActive(transaction: Transaction): boolean {
		return this.parent === undefined || transaction.getVertex(this.parent) === this;
	}

	/**
	 * Evaluates a trigger event at this vertex to determine if it will trigger an outgoing transition.
	 * @param transaction The current transaction being executed.
	 * @param history True if deep history semantics are in play.
	 * @param trigger The trigger event.
	 * @returns Returns true if one of outgoing transitions guard conditions passed.
	 * @internal
	 * @hidden
	 */
	evaluate(transaction: Transaction, history: boolean, trigger: any): boolean {
		const transition = this.getTransition(trigger);

		if (transition) {
			transition.traverse(transaction, history, trigger);

			return true;
		}

		return false;
	}

	/**
	 * Selects an outgoing transition from this vertex based on the trigger event.
	 * @param trigger The trigger event.
	 * @returns Returns a transition or undefined if none were found.
	 * @internal
	 * @hidden
	 */
	getTransition(trigger: any): Transition | undefined {
		return this.outgoing.find(transition => transition.evaluate(trigger));
	}

	/**
	 * Performs the initial steps required to enter a vertex during a state transition; updates teh active state configuration.
	 * @param transaction The current transaction being executed.
	 * @param history Flag used to denote deep history semantics are in force at the time of entry.
	 * @param trigger The event that triggered the state transition.
	 * @internal
	 * @hidden
	 */
	doEnterHead(transaction: Transaction, history: boolean, trigger: any, next: NamedElement | undefined): void {
		super.doEnterHead(transaction, history, trigger, next);

		transaction.setVertex(this);
	}

	/**
	 * Accepts a visitor.
	 * @param visitor The visitor to call back.
	 */
	public abstract accept(visitor: Visitor): void;
}
