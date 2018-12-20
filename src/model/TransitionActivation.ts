import { tree, assert } from '../util';
import { NamedElement } from './NamedElement';
import { Vertex } from './Vertex';
import { PseudoState } from './PseudoState';
import { State } from './State';

/**
 * Encapsulates the semantics of different transition types.
 * @hidden
 */
export interface TransitionActivation {
	toString(): string;
}

/**
 * Semantics of external transitions. Derives elements to exit and enter in advance using the lowest common ancestor rule.
 * @hidden
 */
export class ExternalTransitionActivation implements TransitionActivation {
	readonly toExit: NamedElement;
	readonly toEnter: Array<NamedElement>;

	/**
	 * Creates a new instance of the ExternalTransitionActivation class.
	 * @param source The source vertex of the external transition.
	 * @param target The target vertex of the external transition.
	 */
	constructor(source: Vertex, target: Vertex | undefined) {
		// determine the source and target vertex ancestries
		const sourceAncestors = tree.ancestors<NamedElement>(source, element => element.parent);
		const targetAncestors = tree.ancestors<NamedElement>(target, element => element.parent);

		// determine where to enter and exit from in the ancestries
		const from = tree.lca(sourceAncestors, targetAncestors) + 1; // NOTE: we enter/exit from the elements below the common ancestor
		const to = targetAncestors.length - (target instanceof PseudoState && target.isHistory() ? 1 : 0); // NOTE: if the target is a history pseudo state we just enter the parent region and it's history logic will come into play

		// initialise the base class with source, target and elements to exit and enter		
		this.toExit = sourceAncestors[from];
		this.toEnter = targetAncestors.slice(from, to).reverse();
	}

	/**
	 * Returns the type of the transtiion.
	 */
	public toString(): string {
		return "external";
	}
}

/**
 * Semantics of local transitions. The elements to exit and enter when traversing a local transition  depend on the active state configuration at the time of traversal.
 * @hidden 
 */
export class LocalTransitionActivation implements TransitionActivation {
	readonly target: Vertex;
	vertexToEnter: Vertex | undefined;

	/**
	 * Creates a new instance of the LocalTransitionActivation class.
	 * @param source The source vertex of the local transition.
	 * @param target The target vertex of the local transition.
	 */
	constructor(source: Vertex, target: Vertex | undefined) {
		assert.ok(target, () => `Local transitions must have a target defined`);

		this.target = target!;
	}

	/**
	 * Returns the type of the transtiion.
	 */
	public toString(): string {
		return "local";
	}
}

/**
 * Semantics of local transitions. Local transitions do not chance the active state configuration when traversed.
 * @hidden 
 */
export class InternalTransitionActivation implements TransitionActivation {
	readonly source: State;

	/**
	 * Creates a new instance of the InternalTransitionActivation class.
	 * @param source The source vertex of the internal transition.
	 * @param target The target vertex of the internal transition.
	 */
	constructor(source: Vertex) {
		if (source instanceof State) {
			this.source = source;
		} else {
			throw new Error(`Source of local transition must be a State.`);
		}
	}

	/**
	 * Returns the type of the transtiion.
	 */
	public toString(): string {
		return "internal";
	}
}