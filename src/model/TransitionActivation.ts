import { tree } from '../util';
import { NamedElement } from './NamedElement';
import { PseudoState } from './PseudoState';
import { Transition } from './Transition';
import { State } from './State';

/** Interface describing elements to leave and enter when traversing the transition; derived from the source and target using the TransitionType strategy. */
export interface TransitionActivation {
	toString(): string;
}

export class ExternalTransitionActivation implements TransitionActivation {
	readonly toExit: NamedElement;
	readonly toEnter: Array<NamedElement>;

	constructor(transition: Transition) {
		// determine the source and target vertex ancestries
		const sourceAncestors = tree.ancestors<NamedElement>(transition.source, element => element.parent);
		const targetAncestors = tree.ancestors<NamedElement>(transition.target, element => element.parent);

		// determine where to enter and exit from in the ancestries
		const from = tree.lca(sourceAncestors, targetAncestors) + 1; // NOTE: we enter/exit from the elements below the common ancestor
		const to = targetAncestors.length - (transition.target instanceof PseudoState && transition.target.isHistory() ? 1 : 0); // NOTE: if the target is a history pseudo state we just enter the parent region and it's history logic will come into play

		// initialise the base class with source, target and elements to exit and enter		
		this.toExit = sourceAncestors[from];
		this.toEnter = targetAncestors.slice(from, to).reverse();
	}

	public toString(): string {
		return "external";
	}
}

export class LocalTransitionActivation implements TransitionActivation {
	readonly source: State;
	readonly toEnter: Array<NamedElement>;

	constructor(transition: Transition) {
		// TODO: assertions including source is state
		this.source = transition.source as State;

		// determine the target ancestry
		const targetAncestors = tree.ancestors<NamedElement>(transition.target, element => element.parent); // NOTE: as the target is a child of the source it will be in the same ancestry

		// determine where to enter and exit from in the ancestry
		const from = targetAncestors.indexOf(transition.source) + 2; // NOTE: in local transitions the source vertex is not exited, but the active child substate is
		const to = targetAncestors.length - (transition.target instanceof PseudoState && transition.target.isHistory() ? 1 : 0); // NOTE: if the target is a history pseudo state we just enter the parent region and it's history logic will come into play

		// initialise the base class with source, target and elements to exit and enter
		this.toEnter = targetAncestors.slice(from, to).reverse();
	}

	public toString(): string {
		return "local";
	}
}

export class InternalTransitionActivation implements TransitionActivation {
	readonly source: State;

	constructor(transition: Transition) {
		// TODO: assertions including source is state
		this.source = transition.source as State;
	}

	public toString(): string {
		return "internal";
	}
}