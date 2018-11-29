import { func, assert, log, tree } from '../util';
import { NamedElement } from './NamedElement';
import { Vertex } from './Vertex';
import { PseudoState } from './PseudoState';

/** Interface describing elements to leave and enter when traversing the transition; derived from the source and target using the TransitionType strategy. */
interface TransitionPath {
	leave: NamedElement | undefined;
	enter: Array<NamedElement>;
}

/** A prototype for functions that derive the TransitionPath; instances of which are used in the Transition class using a variant of the strategy pattern. */
type TransitionType = (source: Vertex, target: Vertex | undefined) => TransitionPath;

/** Determines the transition path for internal transitions. */
export function internal(source: Vertex, target: Vertex | undefined): TransitionPath {
	return { leave: undefined, enter: [] };
}

/** Determines the transition path for external transitions. */
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

/** Determines the transition path for local transitions. */
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

/**
 * A transition between vertices that defines a valid change in state in response to an event.
 * @param TTrigger The type of triggering event that causes this transition to be traversed.
 */
export class Transition<TTrigger = any> {
	/**
	 * A predicate used to test that the trigger if of the expected type.
	 * @internal
	 */
	private typeTest: func.Predicate<TTrigger> = () => true;

	/**
	 * A predicate for a user-defined guard condition that must resolve true for the transition to be traversed.
	 * @internal
	 */
	private guard: func.Predicate<TTrigger> = () => true;

	/**
	 * The elements that need to be left and entered when traversing a transition
	 * @internal
	 */
	path: TransitionPath;

	/**
	 * The behavior to call when the transition is traversed.
	 * @internal
	 */
	actions: Array<func.Consumer<TTrigger>> = [];

	/**
	 * Creates an instance of the Transition class.
	 * @param source The source [[Vertex]] of the transition.
	 * @param type The type of triggering event that causes this transition to be traversed.
	 * @public
	 */
	public constructor(public readonly source: Vertex, public target: Vertex | undefined = undefined, type: TransitionType = internal) {
		// create the path based on the provided or default strategy
		this.path = type(this.source, this.target);

		source.outgoing.unshift(this);

		log.info(() => `Created transition from ${source}`, log.Create);
	}

	/**
	 * Adds a predicate to the transition to ensure events must be of a certain event type for the transition to be traversed.
	 * @param type The type of event to test for.
	 * @return Returns the transition.
	 * @public
	 */
	public on(type: func.Constructor<TTrigger>): this {
		this.typeTest = trigger => trigger.constructor === type;

		return this;
	}

	/**
	 * Adds a guard condition to the transition enabling event details to determine if the transition should be traversed.
	 * @param type A predicate taking the trigger event as a parameter.
	 * @return Returns the transition.
	 * @public
	 */
	public when(guard: func.Predicate<TTrigger>): this {
		this.guard = guard;

		return this;
	}

	/**
	 * A pseudonym of [[Transition.when]].
	 * @param type A predicate taking the trigger event as a parameter.
	 * @return Returns the transition.
	 * @public
	 * @deprecated Use Transition.when in its place. This method will be removed in the v8.0 release.
	 */
	public if(guard: func.Predicate<TTrigger>): this {
		return this.when(guard);
	}

	/**
	 * Specifies the target vertex, thereby making the transition an external transition.
	 * @param target The target vertex of the transition
	 * @return Returns the transition.
	 * @public
	 */
	public to(target: Vertex, type: TransitionType = external): this {
		this.target = target;
		this.path = type(this.source, this.target);

		return this;
	}

	/**
	 * Specifies the target vertex which is a child of the source and specify it as a local transition.
	 * @param target The target vertex of the transition
	 * @return Returns the transition.
	 * @public
	 * @deprecated Use the to method with the transition type of local
	 */
	public local(target: Vertex | undefined = undefined): this {
		if (this.target = (this.target || target)) {
			this.path = local(this.source, this.target);
		}

		return this;
	}

    /**
     * Adds behaviour to the transition to be called every time the transition is traversed.
	 * @remarks You may make multiple calls to this method to add more behaviour.
     * @param action The behaviour to call on transition traversal.
     * @returns Returns the transition.
	 * @public
     */
	public do(action: func.Consumer<TTrigger>): this {
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
	public effect(action: func.Consumer<TTrigger>): this {
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