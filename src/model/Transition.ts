import { log, tree } from '../util';
import { NamedElement } from './NamedElement';
import { Vertex } from './Vertex';
import { PseudoState } from './PseudoState';

/**
 * A transition between vertices.
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
	 * @param guard An optional guard condition to further restrict the transition traversal.
	 * @param target The optional target of this transition. If not specified, the transition is an internal transition.
	 * @param local A flag denoting that the transition is a local transition.
	 * @param action An optional action to perform when traversing the transition.
	 */
	public constructor(public readonly source: Vertex, type: (new (...args: any[]) => TTrigger) | undefined, guard: ((trigger: TTrigger) => boolean) | undefined, target: Vertex | undefined, local: boolean, action: ((trigger: TTrigger) => any) | undefined) {
		log.info(() => `Created transition from ${source}`, log.Create);

		if (type) this.on(type);
		if (guard) this.if(guard);
		if (target) this.to(target);
		if (local) this.local();
		if (action) this.do(action);

		source.outgoing.unshift(this);
	}

	public on(type: new (...args: any[]) => TTrigger): this {
		this.typeTest = (trigger: TTrigger) => trigger.constructor === type;

		return this;
	}

	public if(guard: (trigger: TTrigger) => boolean): this {
		this.guard = guard;

		return this;
	}

	public when(guard: (trigger: TTrigger) => boolean): this {
		return this.if(guard);
	}

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

	public local(): this {
		if (this.target) {
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

	public do(action: (trigger: TTrigger) => any): this {
		this.actions.unshift(action);

		return this;
	}

    /**
     * Adds behaviour to the transition to be called every time the transition is traversed.
     * @param action The behaviour to call on transition traversal.
     * @returns Returns the transition.
	 * @public
	 * @deprecated Use Transition.do instead.
     */
	public effect(action: (trigger: TTrigger) => void): this {
		return this.do(action);
	}

	evaluate(trigger: TTrigger): boolean {
		return this.typeTest(trigger) && this.guard(trigger);
	}
}
