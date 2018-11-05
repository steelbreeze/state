import { log, tree } from '../util';
import { /*History,*/ PseudoStateKind } from './PseudoStateKind';
import { State } from './State';
import { Region } from './Region';
import { Transition } from './Transition';
import { PseudoState } from './PseudoState';

/**
 * A local transition is one where the target vertex is a child of source composite state; the source composite state is not exited when traversed.
 * @public
 */
export class LocalTransition<TTrigger> extends Transition<TTrigger> {
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
	 * Creates a new instance of the LocalTransition class.
	 * @param TTrigger The type of the trigger that will cause this transition to be traversed.
	 * @param source The source state of the transition.
	 * @param target The target state of the transition to traverse to.
	 * @summary A local transition, when traversed will:
	 * exit all elements from the state below the source;
	 * perform the transition behaviour;
	 * enter all elements from the state below the source to the target.
	 * @public
	 */
	public constructor(public readonly source: State, target: State | PseudoState) {
		super(source, target);

		// determine the target ancestry
		const targetAncestors = tree.ancestors<Region | State | PseudoState>(target, element => element.parent); // NOTE: as the target is a child of the source it will be in the same ancestry

		// determine where to enter and exit from in the ancestry
		const from = targetAncestors.indexOf(source) + 2; // NOTE: in local transitions the source vertex is not exited, but the active child substate is
		const to = targetAncestors.length - (target instanceof PseudoState && target.isHistory() ? 1 : 0); // NOTE: if the target is a history pseudo state we just enter the parent region and it's history logic will come into play

		// initialise the base class with source, target and elements to exit and enter
		this.toLeave = targetAncestors[from];
		this.toEnter = targetAncestors.slice(from, to).reverse(); // NOTE: reversed as we use a reverse-for at runtime for performance

		log.info(() => `Created local transition from ${source} to ${target}`, log.Create);
	}
}