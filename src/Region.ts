import { assert, log } from './util';
import { NamedElement } from './NamedElement';
import { State } from './State';
import { PseudoStateKind } from './PseudoStateKind';
import { PseudoState } from './PseudoState';
import { Vertex } from './Vertex';
import { IInstance } from './IInstance';

/**
 * A region is a container of vertices (states and pseudo states) in a state machine model.
 * @public
 */
export class Region implements NamedElement<State> {
	/**
	 * The fully qualified name of the region including its parent's qualified name.
	 * @public
	 */
	public readonly qualifiedName: string;

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
	public constructor(public readonly name: string, public readonly parent: State) {
		this.qualifiedName = `${parent}.${name}`;

		this.parent.children.unshift(this);

		log.info(() => `Created region ${this}`, log.Create);
	}

	enter(instance: IInstance, deepHistory: boolean, trigger: any): void {
		this.enterHead(instance, deepHistory, trigger, undefined);
		this.enterTail(instance, deepHistory, trigger);
	}

	/** Initiate region entry */
	enterHead(instance: IInstance, deepHistory: boolean, trigger: any, nextElement: NamedElement | undefined): void {
		log.info(() => `${instance} enter ${this}`, log.Entry);
	}

	/** Complete region entry */
	enterTail(instance: IInstance, deepHistory: boolean, trigger: any): void {
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
	leave(instance: IInstance, deepHistory: boolean, trigger: any): void {
		// cascade the leave operation to the currently active child vertex
		instance.getVertex(this).leave(instance, deepHistory, trigger);

		log.info(() => `${instance} leave ${this}`, log.Exit);
	}


	/**
	 * Returns the fully qualified name of the region.
	 * @public
	 */
	public toString(): string {
		return this.qualifiedName;
	}
}
