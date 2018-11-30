import { assert, tree } from '../util';
import { NamedElement } from './NamedElement';
import { Vertex } from './Vertex';
import { PseudoState } from './PseudoState';
import { TransitionPath } from './TransitionPath';

/**
 * A transition's kind determines its traverasal behaviour.
 * @remarks These functions implement strategies in a variant of the strategy pattern that uses just functions instead of classes.
 */
export namespace TransitionKind {
	/**
	 * An external transition is the default transition kind between any two vertices (states or pseudo states).
	 * Upon traversal it will: exit the source vertex and any parent elements (vertex or region) up to, but not including the common ancestor of the source and target;
	 * it will then perform and user defined transition behaviour;
	 * finally, it will enter the target vertex, having first entered any parent elements below the common ancestor as needed.
	 * If the source or target vertices are not leaf-level elements within the state machine hierarchy, the exit or entry operation will cascate to child elements as needed.
	 */
	export function external(source: Vertex, target: Vertex | undefined): TransitionPath {
		// determine the source and target vertex ancestries
		const sourceAncestors = tree.ancestors<NamedElement>(source, element => element.parent);
		const targetAncestors = tree.ancestors<NamedElement>(target, element => element.parent);

		// determine where to enter and exit from in the ancestries
		const from = tree.lca(sourceAncestors, targetAncestors) + 1; // NOTE: we enter/exit from the elements below the common ancestor
		const to = targetAncestors.length - (target instanceof PseudoState && target.isHistory() ? 1 : 0); // NOTE: if the target is a history pseudo state we just enter the parent region and it's history logic will come into play

		// initialise the base class with source, target and elements to exit and enter		
		return { leave: sourceAncestors[from], enter: targetAncestors.slice(from, to).reverse() };
	}

	/**
	 * An internal transition does not cause a change of state; when traversed it only executes the user defined transition behaviour.
	 */
	export function internal(source: Vertex, target: Vertex | undefined): TransitionPath {
		return { leave: undefined, enter: undefined };
	}

	/**
	 * A local transition is one where either the source or target is the common ancestor of both vertices.
	 * Traversal is the same as an external transition but the common ancestor is not entered/exited.
	 */
	export function local(source: Vertex, target: Vertex | undefined): TransitionPath { // TODO: need to cater for transitions where the target is the parent of the source
		// determine the target ancestry
		const targetAncestors = tree.ancestors<NamedElement>(target, element => element.parent); // NOTE: as the target is a child of the source it will be in the same ancestry

		// test that the target is a child of the source
		assert.ok(targetAncestors.indexOf(source) !== -1, () => `Source vertex (${source}) must an ancestor of the target vertex (${target})`);

		// determine where to enter and exit from in the ancestry
		const from = targetAncestors.indexOf(source) + 2; // NOTE: in local transitions the source vertex is not exited, but the active child substate is
		const to = targetAncestors.length - (target instanceof PseudoState && target.isHistory() ? 1 : 0); // NOTE: if the target is a history pseudo state we just enter the parent region and it's history logic will come into play

		// initialise the base class with source, target and elements to exit and enter
		return { leave: targetAncestors[from], enter: targetAncestors.slice(from, to).reverse() };
	}
}