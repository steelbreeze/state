import { log, tree } from '../util';
import { Region } from './Region';
import { State } from './State';
import { PseudoState } from './PseudoState';
import { Transition } from './Transition';

/**
 * An external transition is the default transition type within a state machine, enabling transitions between any pair of vertices.
 * @param TTrigger The type of the trigger event that may cause this transition to be traversed.
 * @public
 */
export class ExternalTransition<TTrigger = any> extends Transition<TTrigger> {
	/**
	 * The element to exit when traversing this transition; the exit operation will cascade though all current active child substate.
	 * @internal
	 */
	readonly toLeave: Region | State | PseudoState;

	/**
	 * The elements to enter when traversing this transition; the entry operation on the last will cascade to any child substate.
	 * @internal
	 */
	readonly toEnter: Array<Region | State | PseudoState>;

	/**
	 * Creates a new instance of the ExternalTransition class.
	 * @param TTrigger The type of the trigger that will cause this transition to be traversed.
	 * @param source The source vertex to exit when the transition fires.
	 * @param target The target vertex to enter when the transition fires.
	 * @summary An external transition, when traversed will:
	 * exit all elements from the element below the common ancestor of the source and target to the source;
	 * perform the transition behaviour;
	 * enter all elements from the element below the common ancestor of the source and target to the target.
	 * @public
	 */
	public constructor(public readonly source: State | PseudoState, target: State | PseudoState) {
		super(source, target);

		// determine the source and target vertex ancestries
		const sourceAncestors = tree.ancestors<Region | State | PseudoState>(source, element => element.parent);
		const targetAncestors = tree.ancestors<Region | State | PseudoState>(target, element => element.parent);

		// determine where to enter and exit from in the ancestries
		const from = tree.lca(sourceAncestors, targetAncestors) + 1; // NOTE: we enter/exit from the elements below the common ancestor
		const to = targetAncestors.length - (target instanceof PseudoState && target.isHistory() ? 1 : 0); // NOTE: if the target is a history pseudo state we just enter the parent region and it's history logic will come into play

		// initialise the base class with source, target and elements to exit and enter		
		this.toLeave = sourceAncestors[from];
		this.toEnter = targetAncestors.slice(from, to).reverse(); // NOTE: reversed as we use a reverse-for at runtime for performance

		log.info(() => `Created external transition from ${source} to ${target}`, log.Create);
	}
}
