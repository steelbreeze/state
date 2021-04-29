import { log, PseudoStateKind, Vertex, State, PseudoState, Visitor } from '.';
import { Transaction } from './Transaction';

/**
 * A region is a container of vertices (states and pseudo states) within a state machine model.
 */
export class Region {
	/**
	 * The child states of this region.
	 * @internal
	 * @hidden
	 */
	 states: Array<State> = [];

	/**
	 * The initial pseudo state, defining the starting vertex when region is entered.
	 * @internal
	 * @hidden
	 */
	initial: PseudoState | undefined;

	/**
	 * Creates a new instance of the Region class.
	 * @param name The name of the region.
	 * @param parent The parent state of this region.
	 */
	public constructor(public readonly name: string, public readonly parent: State) {
		log.write(() => `Created ${this}`, log.Create);

		parent.regions.push(this);
	}

	/** 
	 * Tests a state machine instance to see if this region is complete within it.
	 * A region is complete if it's current state is a final state (one with no outgoing transitions).
	 * @internal
	 * @hidden 
	 */
	isComplete(transaction: Transaction): boolean {
		const currentState = transaction.get(this);

		return currentState !== undefined && currentState.isFinal();
	}

	/**
	 * Determines if the region has a particular history semantic.
	 * @hidden 
	 */
	history(deepHistory: boolean, kind: PseudoStateKind): boolean {
		return deepHistory || (this.initial !== undefined && !!(this.initial.kind & kind));
	}

	/**
	 * Enters an element during a state transition.
	 * @param transaction The current transaction being executed.
	 * @param deepHistory Flag used to denote deep history semantics are in force at the time of entry.
	 * @param trigger The event that triggered the state transition.
	 * @param next The next element to enter in a non-cascaded entry, driven by external transitions.
	 * @internal
	 * @hidden
	 */
	doEnter(transaction: Transaction, deepHistory: boolean, trigger: any, next: Region | Vertex | undefined): void {
		log.write(() => `${transaction.instance} enter ${this}`, log.Entry);

		if (!next) {
			const starting = this.history(deepHistory, PseudoStateKind.History) ? transaction.get(this) || this.initial : this.initial;

			if (starting) {
				starting.doEnter(transaction, this.history(deepHistory, PseudoStateKind.DeepHistory), trigger, undefined);
			} else {
				throw new Error(`No staring vertex found when entering region ${this}`);
			}
		}
	}

	/**
	 * Exits a region during a state transition.
	 * @param transaction The current transaction being executed.
	 * @param deepHistory Flag used to denote deep history semantics are in force at the time of exit.
	 * @param trigger The event that triggered the state transition.
	 * @internal
	 * @hidden
	 */
	doExit(transaction: Transaction, deepHistory: boolean, trigger: any): void {
		const vertex = transaction.getVertex(this);

		if (vertex) {
			vertex.doExit(transaction, deepHistory, trigger);
		}

		log.write(() => `${transaction.instance} leave ${this}`, log.Exit);
	}

	/**
	 * Accepts a visitor and calls back its visitRegion method and cascade to child vertices.
	 * @param visitor The visitor to call back.
	 */
	public accept(visitor: Visitor): void {
		visitor.visitRegion(this);

		this.states.forEach(vertex => vertex.accept(visitor));

		visitor.visitRegionTail(this);
	}

	/**
	 * Returns the element in string form; the fully qualified name of the element.
	 */
	public toString(): string {
		return `${this.parent}.${this.name}`;
	}
}
