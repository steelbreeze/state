import { tree } from './util';
import { NamedElement } from './NamedElement';
import { Vertex } from './Vertex';
import { PseudoState } from './PseudoState';
import { State } from './State';
import { IInstance } from './IInstance';

import { completion } from './core';

/**
 * Encapsulates the semantics of different transition types.
 * @hidden
 */
export interface TransitionActivation {
	exitSource(instance: IInstance, deepHistory: boolean, trigger: any): void;
	enterTarget(instance: IInstance, deepHistory: boolean, trigger: any): void;

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
	constructor(source: Vertex, target: Vertex) {
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

	exitSource(instance: IInstance, deepHistory: boolean, trigger: any): void {
		// exit the element below the common ancestor
		this.toExit.leave(instance, deepHistory, trigger);
	}

	enterTarget(instance: IInstance, deepHistory: boolean, trigger: any): void {
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
 * Semantics of local transitions. The elements to exit and enter when traversing a local transition  depend on the active state configuration at the time of traversal.
 * @hidden 
 */
export class LocalTransitionActivation implements TransitionActivation {
	private vertexToEnter: Vertex | undefined;
	/**
	 * Creates a new instance of the LocalTransitionActivation class.
	 * @param source The source vertex of the local transition.
	 * @param target The target vertex of the local transition.
	 */
	constructor(source: Vertex, public readonly target: Vertex) {
	}

	exitSource(instance: IInstance, deepHistory: boolean, trigger: any): void {
		this.vertexToEnter = this.target;

		// iterate towards the root until we find an active state
		while (this.vertexToEnter.parent && !this.vertexToEnter.parent.parent.isActive(instance)) {
			this.vertexToEnter = this.vertexToEnter.parent.parent;
		}

		// exit the currently active vertex in the target vertex's parent region
		if (!this.vertexToEnter.isActive(instance) && this.vertexToEnter.parent) {
			instance.getVertex(this.vertexToEnter.parent).leave(instance, deepHistory, trigger);
		}
	}

	enterTarget(instance: IInstance, deepHistory: boolean, trigger: any): void {
		if (this.vertexToEnter && !this.vertexToEnter.isActive(instance)) {
			this.vertexToEnter!.enter(instance, deepHistory, trigger);
		}
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
	constructor(source: Vertex, target: Vertex) {
		if (source instanceof State) {
			this.source = source;
		} else {
			throw new Error(`Source of local transition must be a State.`);
		}
	}

	exitSource(instance: IInstance, deepHistory: boolean, trigger: any): void {
		// don't exit anything
	}

	enterTarget(instance: IInstance, deepHistory: boolean, trigger: any): void {
		// test for completion transitions for internal transitions as there will be state entry/exit performed where the test is usually performed
		completion(this.source, instance, deepHistory, this.source);
	}

	/**
	 * Returns the type of the transtiion.
	 */
	public toString(): string {
		return "internal";
	}
}
