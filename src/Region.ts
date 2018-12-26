import { assert, log } from './util';
import { PseudoStateKind, State, PseudoState, Instance } from './index';
import { NamedElement } from './NamedElement';
import { Vertex } from './Vertex';

/**
 * A region is a container of vertices (states and pseudo states) in a state machine model.
 * @public
 */
export class Region extends NamedElement<State> {
	/**
	 * The child vertices belonging to this region.
	 * @internal
	 */
	children: Array<Vertex> = [];

	/**
	 * The initial starting pseudo state of this region; saves the costly process of searching for it at runtime.
	 * @internal
	 */
	starting: PseudoState | undefined;

	/**
	 * Creates a new instance of the Region class.
	 * @param name The name of the region.
	 * @param parent The parent state of the region.
	 * @public
	 */
	public constructor(name: string, parent: State) {
		super(name, parent);

		// add this region to the parent state
		this.parent.children.unshift(this);
	}

	/** Complete region entry */
	enterTail(instance: Instance, deepHistory: boolean, trigger: any): void {
		let current: State | undefined;
		let starting: Vertex | undefined = this.starting;

		// determine if history semantics are in play and the region has previously been entered then select the starting vertex accordingly
		if ((deepHistory || (this.starting && this.starting.isHistory())) && (current = instance.getState(this))) {
			starting = current;
			deepHistory = deepHistory || (this.starting!.kind === PseudoStateKind.DeepHistory);
		}

		assert.ok(starting, () => `${instance} no initial pseudo state found at ${this}`);

		// cascade the entry operation to the approriate child vertex
		starting!.enter(instance, deepHistory, trigger);
	}

	/** Leave a region */
	leave(instance: Instance, deepHistory: boolean, trigger: any): void {
		// cascade the leave operation to the currently active child vertex
		instance.getVertex(this).leave(instance, deepHistory, trigger);

		super.leave(instance, deepHistory, trigger);
	}
}