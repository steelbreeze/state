import { func } from './util';
import { NamedElement } from './NamedElement';
import { Vertex } from './Vertex';
import { PseudoState, Instance } from './index';
import { TransitionActivation } from './TransitionActivation';

/**
 * Semantics of external transitions. Derives elements to exit and enter in advance using the lowest common ancestor rule.
 */
export class ExternalTransitionActivation implements TransitionActivation {
	private readonly toExit: NamedElement;
	private readonly toEnter: Array<NamedElement>;

	/**
	 * Creates a new instance of the ExternalTransitionActivation class.
	 * @param source The source vertex of the external transition.
	 * @param target The target vertex of the external transition.
	 */
	constructor(source: Vertex, target: Vertex) {
		// determine the source and target vertex ancestries
		const sourceAncestors = ancestors<NamedElement>(source, element => element.parent);
		const targetAncestors = ancestors<NamedElement>(target, element => element.parent);

		// determine where to enter and exit from in the ancestries
		const from = lca(sourceAncestors, targetAncestors) + 1; // NOTE: we enter/exit from the elements below the common ancestor
		const to = targetAncestors.length - (target instanceof PseudoState && target.isHistory() ? 1 : 0); // NOTE: if the target is a history pseudo state we just enter the parent region and it's history logic will come into play

		// initialise the base class with source, target and elements to exit and enter		
		this.toExit = sourceAncestors[from];
		this.toEnter = targetAncestors.slice(from, to).reverse();
	}

	/**
	 * Exits the source of the transition
	 * @param instance The state machine instance.
	 * @param deepHistory True if deep history semantics are in force at the time of exit.
	 * @param trigger The trigger event that caused the exit operation.
	 */
	exitSource(instance: Instance, deepHistory: boolean, trigger: any): void {
		// exit the element below the common ancestor
		this.toExit.leave(instance, deepHistory, trigger);
	}

	/**
	 * Exits the target of the transition
	 * @param instance The state machine instance.
	 * @param deepHistory True if deep history semantics are in force at the time of entry.
	 * @param trigger The trigger event that caused the exit operation.
	 */
	enterTarget(instance: Instance, deepHistory: boolean, trigger: any): void {
		// enter elements below the common ancestor to the target
		for (var i = this.toEnter.length; i--;) {
			this.toEnter[i].enterHead(instance, deepHistory, trigger, this.toEnter[i - 1]);
		}

		// cascade the entry action to any child elements of the target
		this.toEnter[0].enterTail(instance, deepHistory, trigger);
	}

	/**
	 * Returns the type of the transtiion.
	 */
	public toString(): string {
		return "external";
	}
}

/**
 * Returns the ancesry of a node within a tree, from the root node to the provided node.
 * @param node The node to get the ancestry of.
 * @param getParent A function that will return the immediate parent of a node.
 * @returns Returns an array of nodes with the root node of the tree in element 0.
 * @internal
 */
function ancestors<TNode>(node: TNode | undefined, getParent: func.Func<TNode | undefined, TNode>): Array<TNode> {
	const result: Array<TNode> = [];

	while (node) {
		result.unshift(node);

		node = getParent(node);
	}

	return result;
}

/**
 * Returns the index of the lowest common ancestor of two ancestry arrays.
 * @param a The first anccesrty array.
 * @param b The second ancestry array.
 * @returns Returns the index of the lowest common ancestor.
 * @internal
 */
function lca<TNode>(a: Array<TNode>, b: Array<TNode>): number {
	const max = Math.min(a.length, b.length);
	let result = 0;

	while (result < max && a[result] === b[result]) {
		result++;
	}

	return result - (result !== max ? 1 : 2);
}
