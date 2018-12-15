import { assert, tree } from '../util';
import { NamedElement } from './NamedElement';
import { Vertex } from './Vertex';
import { PseudoState } from './PseudoState';
import { TransitionPath } from './TransitionPath';

/**
 * A transition's kind determines which elements will be exited and entered upon traversal.
 * @remarks TransitionKind is an implementation of the strategy pattern.
 */
export interface TransitionKind {
	/**
	 * Derives the path of elements to exit and enter when travesing a transition of a particular kind.
	 * @param source The source vertex of the transition.
	 * @param target The optional target vertex of the transition.
	 * @returns Returns the path of element to exit and enter when traversing the transition.
	 */
	getPath(source: Vertex, target: Vertex | undefined): TransitionPath;
}

/**
 * An external transition is the default transition kind between any two vertices (states or pseudo states).
 * Upon traversal it will: exit the source vertex and any parent elements (vertex or region) up to, but not including the common ancestor of the source and target;
 * it will then perform and user defined transition behaviour;
 * finally, it will enter the target vertex, having first entered any parent elements below the common ancestor as needed.
 * If the source or target vertices are not leaf-level elements within the state machine hierarchy, the exit or entry operation will cascate to child elements as needed.
 * @internal
 */
class ExternalTransitionKind implements TransitionKind {
	/**
	 * Derives the path of elements to exit and enter when travesing an external transition.
	 * @param source The source vertex of the transition.
	 * @param target The optional target vertex of the transition.
	 * @returns Returns the path of element to exit and enter when traversing the transition.
	 */
	getPath(source: Vertex, target: Vertex | undefined): TransitionPath {
		// determine the source and target vertex ancestries
		const sourceAncestors = tree.ancestors<NamedElement>(source, element => element.parent);
		const targetAncestors = tree.ancestors<NamedElement>(target, element => element.parent);

		// determine where to enter and exit from in the ancestries
		const from = tree.lca(sourceAncestors, targetAncestors) + 1; // NOTE: we enter/exit from the elements below the common ancestor
		const to = targetAncestors.length - (target instanceof PseudoState && target.isHistory() ? 1 : 0); // NOTE: if the target is a history pseudo state we just enter the parent region and it's history logic will come into play

		// initialise the base class with source, target and elements to exit and enter		
		return new TransitionPath(this, sourceAncestors[from], targetAncestors.slice(from, to).reverse());
	}

	public toString(): string {
		return "external";
	}
}

/**
 * An internal transition does not cause a change of state; when traversed it only executes the user defined transition behaviour.
 * @internal
 */
class InternalTransitionKind implements TransitionKind {
	/**
	 * Derives the path of elements to exit and enter when travesing an internal transition.
	 * @param source The source vertex of the transition.
	 * @param target The optional target vertex of the transition.
	 * @returns Returns the path of element to exit and enter when traversing the transition.
	 */
	getPath(source: Vertex, target: Vertex | undefined): TransitionPath {
		return new TransitionPath(this);
	}

	public toString(): string {
		return "internal";
	}
}

/**
 * A local transition is one where either the source or target is the common ancestor of both vertices.
 * Traversal is the same as an external transition but the common ancestor is not entered/exited.
 * @internal
 */
class LocalTransitionKind implements TransitionKind {
	/**
	 * Derives the path of elements to exit and enter when travesing a local transition.
	 * @param source The source vertex of the transition.
	 * @param target The optional target vertex of the transition.
	 * @returns Returns the path of element to exit and enter when traversing the transition.
	 */
	getPath(source: Vertex, target: Vertex | undefined): TransitionPath {
		// determine the target ancestry
		const targetAncestors = tree.ancestors<NamedElement>(target, element => element.parent); // NOTE: as the target is a child of the source it will be in the same ancestry

		// test that the target is a child of the source
		assert.ok(targetAncestors.indexOf(source) !== -1, () => `Source vertex (${source}) must an ancestor of the target vertex (${target})`);

		// determine where to enter and exit from in the ancestry
		const from = targetAncestors.indexOf(source) + 2; // NOTE: in local transitions the source vertex is not exited, but the active child substate is
		const to = targetAncestors.length - (target instanceof PseudoState && target.isHistory() ? 1 : 0); // NOTE: if the target is a history pseudo state we just enter the parent region and it's history logic will come into play

		// initialise the base class with source, target and elements to exit and enter
		return new TransitionPath(this, targetAncestors[from], targetAncestors.slice(from, to).reverse());
	}

	public toString(): string {
		return "local";
	}
}

// extend the TransitionKind interface, adding instances of each strategy as constants making it appear like an enumeration.
export namespace TransitionKind {
	/**
	 * An external transition is the default transition kind between any two vertices (states or pseudo states).
	 * Upon traversal it will: exit the source vertex and any parent elements (vertex or region) up to, but not including the common ancestor of the source and target;
	 * it will then perform and user defined transition behaviour;
	 * finally, it will enter the target vertex, having first entered any parent elements below the common ancestor as needed.
	 * If the source or target vertices are not leaf-level elements within the state machine hierarchy, the exit or entry operation will cascate to child elements as needed.
	 */
	export const external: TransitionKind = new ExternalTransitionKind();

	/**
	 * An internal transition does not cause a change of state; when traversed it only executes the user defined transition behaviour.
	 */
	export const internal: TransitionKind = new InternalTransitionKind();

	/**
	 * A local transition is one where either the source or target is the common ancestor of both vertices.
	 * Traversal is the same as an external transition but the common ancestor is not entered/exited.
	 */
	export const local: TransitionKind = new LocalTransitionKind();
}
