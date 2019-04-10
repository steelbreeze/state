import { PseudoStateKind, NamedElement, Vertex, State, PseudoState, Instance, Visitor } from '.';

/**
 * A region is a container of vertices (states and pseudo states) within a state machine model.
 */
export class Region extends NamedElement {
	/**
	 * The child  vertices of this region.
	 * @internal
	 * @hidden
	 */
	children: Array<Vertex> = [];

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
	public constructor(name: string, public readonly parent: State) {
		super(name, parent);

		parent.children.push(this);
	}

	/**
	 * Returns the parent element of this region.
	 * @returns Returns the parent element of this element.
	 * @internal
	 * @hidden
	 */
	getParent(): NamedElement | undefined {
		return this.parent;
	}

	/** 
	 * Tests a state machine instance to see if this region is complete within it.
	 * A region is complete if it's current state is a final state (one with no outgoing transitions).
	 * @internal
	 * @hidden 
	 */
	isComplete(instance: Instance): boolean {
		const currentState = instance.getState(this);

		return currentState && currentState.isFinal();
	}

	/**
	 * Performs the final steps required to enter the region dueing state transition; enters the region using the initial pseudo state or history logic.
	 * @param instance The state machine instance that is entering the element.
	 * @param history Flag used to denote deep history semantics are in force at the time of entry.
	 * @param trigger The event that triggered the state transition.
	 * @internal
	 * @hidden
	 */
	doEnterTail(instance: Instance, history: boolean, trigger: any): void {
		const current = instance.getState(this);
		const starting = (history || (this.initial && this.initial.isHistory) && current) ? current : this.initial;

		if (starting) {
			starting.doEnter(instance, history || (this.initial!.kind === PseudoStateKind.DeepHistory), trigger);
		}
	}

	/**
	 * Exits a region during a state transition.
	 * @param instance The state machine instance that is exiting the element.
	 * @param history Flag used to denote deep history semantics are in force at the time of exit.
	 * @param trigger The event that triggered the state transition.
	 * @internal
	 * @hidden
	 */
	doExit(instance: Instance, history: boolean, trigger: any): void {
		instance.getVertex(this).doExit(instance, history, trigger);

		super.doExit(instance, history, trigger);
	}

	/**
	 * Accepts a visitor and calls back its visitRegion method and cascade to child vertices.
	 * @param visitor The visitor to call back.
	 */
	public accept(visitor: Visitor): void {
		visitor.visitRegionHead(this);

		for (const vertex of this.children) {
			vertex.accept(visitor);
		}

		visitor.visitRegionTail(this);
	}
}
