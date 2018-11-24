import { log, tree } from '../util';
import { NamedElement } from './NamedElement';
import { Vertex } from './Vertex';
import { PseudoState } from './PseudoState';

/**
 * A transition between vertices that defines a valid change in state in response to an event.
 * @param TTrigger The type of triggering event that causes this transition to be traversed.
 */
export class Transition<TTrigger = any> {
	public target: Vertex | undefined;
	private typeTest: (trigger: TTrigger) => boolean = () => true;
	private guard: (trigger: TTrigger) => boolean = () => true;

	/**
	 * The element to exit when traversing this transition; the exit operation will cascade though all current active child substate.
	 * @internal
	 */
	toLeave: NamedElement | undefined;

	/**
	 * The elements to enter when traversing this transition; the entry operation on the last will cascade to any child substate.
	 * @internal
	 */
	toEnter: Array<NamedElement> | undefined;

	/**
	 * The behavior to call when the transition is traversed.
	 * @internal
	 */
	actions: Array<(trigger: TTrigger) => void> = [];

	/**
	 * Creates an instance of the Transition class.
	 * @param source The source [[Vertex]] of the transition.
	 * @param type The type of triggering event that causes this transition to be traversed.
	 * @public
	 */
	public constructor(public readonly source: Vertex) {
		source.outgoing.unshift(this);

		log.info(() => `Created transition from ${source}`, log.Create);
	}

	/**
	 * Adds a predicate to the transition to ensure events must be of a certain event type for the transition to be traversed.
	 * @param type The type of event to test for.
	 * @return Returns the transition.
	 * @public
	 */
	public on(type: new (...args: any[]) => TTrigger): this {
		this.typeTest = (trigger: TTrigger) => trigger.constructor === type;

		return this;
	}

	/**
	 * Adds a guard condition to the transition enabling event details to determine if the transition should be traversed.
	 * @param type A boolean predicate taking the trigger event as a parameter.
	 * @return Returns the transition.
	 * @public
	 */
	public if(guard: (trigger: TTrigger) => boolean): this {
		this.guard = guard;

		return this;
	}

	/**
	 * A pseudonym of [[Transition.if]].
	 * @param type A boolean predicate taking the trigger event as a parameter.
	 * @return Returns the transition.
	 * @public
	 * @deprecated Use Transition.if in its place. This method will be removed in the v8.0 release.
	 */
	public when(guard: (trigger: TTrigger) => boolean): this {
		return this.if(guard);
	}

	/**
	 * Specifies the target vertex, thereby making the transition an external transition.
	 * @param target The target vertex of the transition
	 * @return Returns the transition.
	 * @public
	 */
	public to(target: Vertex): this {
		this.target = target;

		// determine the source and target vertex ancestries
		const sourceAncestors = tree.ancestors<NamedElement>(this.source, element => element.parent);
		const targetAncestors = tree.ancestors<NamedElement>(target, element => element.parent);

		// determine where to enter and exit from in the ancestries
		const from = tree.lca(sourceAncestors, targetAncestors) + 1; // NOTE: we enter/exit from the elements below the common ancestor
		const to = targetAncestors.length - (target instanceof PseudoState && target.isHistory() ? 1 : 0); // NOTE: if the target is a history pseudo state we just enter the parent region and it's history logic will come into play

		// initialise the base class with source, target and elements to exit and enter		
		this.toLeave = sourceAncestors[from];
		this.toEnter = targetAncestors.slice(from, to).reverse(); // NOTE: reversed as we use a reverse-for at runtime for performance

		return this;
	}

	/**
	 * Specifies the target vertex which is a child of the source and specify it as a local transition.
	 * @param target The target vertex of the transition
	 * @return Returns the transition.
	 * @public
	 */
	public local(target: Vertex | undefined = undefined): this {
		if (this.target = (this.target || target)) {
			// TODO: test that the target is a child of the parent

			// determine the target ancestry
			const targetAncestors = tree.ancestors<NamedElement>(this.target, element => element.parent); // NOTE: as the target is a child of the source it will be in the same ancestry

			// determine where to enter and exit from in the ancestry
			const from = targetAncestors.indexOf(this.source) + 2; // NOTE: in local transitions the source vertex is not exited, but the active child substate is
			const to = targetAncestors.length - (this.target instanceof PseudoState && this.target.isHistory() ? 1 : 0); // NOTE: if the target is a history pseudo state we just enter the parent region and it's history logic will come into play

			// initialise the base class with source, target and elements to exit and enter
			this.toLeave = targetAncestors[from];
			this.toEnter = targetAncestors.slice(from, to).reverse(); // NOTE: reversed as we use a reverse-for at runtime for performance
		}

		return this;
	}

    /**
     * Adds behaviour to the transition to be called every time the transition is traversed.
	 * @remarks You may make multiple calls to this method to add more behaviour.
     * @param action The behaviour to call on transition traversal.
     * @returns Returns the transition.
	 * @public
	 * @deprecated Use Transition.do instead. This method will be removed in the v8.0 release.
     */
	public do(action: (trigger: TTrigger) => any): this {
		this.actions.unshift(action);

		return this;
	}

    /**
     * Adds behaviour to the transition to be called every time the transition is traversed.
     * @param action The behaviour to call on transition traversal.
     * @returns Returns the transition.
	 * @public
	 * @deprecated Use Transition.do instead. This method will be removed in the v8.0 release.
     */
	public effect(action: (trigger: TTrigger) => void): this {
		return this.do(action);
	}

	/**
	 * Tests an event against the type test and guard condition to see if the event might cause this transition to be traversed.
	 * @param trigger The triggering event.
	 * @returns Returns true if the trigger passes the type test and guard condition.
	 * @internal
	 */
	evaluate(trigger: TTrigger): boolean {
		return this.typeTest(trigger) && this.guard(trigger);
	}
}
