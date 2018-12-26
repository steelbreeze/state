import { func, assert, log, random } from './util';
import { PseudoStateKind, TransitionKind, State, Region, Transition, Instance } from './index';
import { NamedElement } from './NamedElement';
import { Vertex } from './Vertex';

/**
 * A pseudo state is a transient elemement within a state machine, once entered it will evaluate outgoing transitions and attempt to exit.
 * @public
 */
export class PseudoState extends Vertex {
	/** 
	 * The else transition that may be used by branch pseudo states; saves the costly process of searching for it at runtime.
	 * @internal 
	 */
	elseTransition: Transition | undefined;

	/**
	 * Creates a new instance of the PseudoState class.
	 * @param name The name of the pseudo state.
	 * @param parent The parent region of the pseudo state; a state may also be specified in which case the state's default region will be used as the parent region.
	 * @param kind The kind of pseudo state; this defines its behaviour and use. See PseudoStateKind for more information.
	 */
	public constructor(public readonly name: string, parent: State | Region, public readonly kind: PseudoStateKind = PseudoStateKind.Initial) {
		super(name, parent);

		// if this is a starting state (initial, deep or shallow history), record it against the parent region
		if (this.kind === PseudoStateKind.Initial || this.isHistory()) {
			// TODO: FIX			assert.ok(this.parent!.starting, () => `Only one initial pseudo state is allowed in region ${this.parent}`);

			this.parent!.starting = this;
		}
	}

	/**
	 * Tests a pseudo state to see if is is a history pseudo state
	 * @returns Returns true if the pseudo state is of the deep or shallow history kind
	 */
	public isHistory(): boolean {
		return this.kind === PseudoStateKind.DeepHistory || this.kind === PseudoStateKind.ShallowHistory;
	}

	/**
	 * Creates a new transition with a type test.
	 * @remarks Once creates with the [[Vertex.on]] method, the transition can be enhanced using the fluent API calls of [[Transition.when]], [[Transition.to]] and [[Transition.do]].
	 * @param type The type of event that this transition will look for.
	 * @returns Returns the newly created transition.
	 */
	public on<TTrigger>(type: func.Constructor<TTrigger>): Transition<TTrigger> {
		return new Transition<TTrigger>(this, undefined, TransitionKind.internal, type);
	}

	/**
	 * Adds a user-defined guard condition that allows to further restricts the conditions under which a transition may be traversed.
	 * @param guard The guard condition that takes the triggering event as a parameter and returns a boolean.
	 */
	public when<TTrigger>(guard: func.Predicate<TTrigger>): Transition<TTrigger> {
		return new Transition<TTrigger>(this, undefined, TransitionKind.internal, undefined, guard);
	}

	/**
	 * Creates a new external transition with a target vertex.
	 * @remarks Once creates with the [[Vertex.tn]] method, the transition can be enhanced using the fluent API calls of [[Transition.on]] [[Transition.if]], [[Transition.local]] and [[Transition.do]]. If an event test is needed, create the transition with the [[on]] method.
	 * @param to The target vertex of the transition.
	 * @returns Returns the newly created transition.
	 */
	public to<TTrigger>(target: Vertex): Transition<TTrigger> {
		return new Transition<TTrigger>(this, target, TransitionKind.external);
	}

	/**
	 * Creates an else transition from Junction or Choice pseudo states.
	 * @param to The target vertex of the transition.
	 * @returns Returns the newly created transition.
	 */
	public else<TTrigger>(target: Vertex): Transition<TTrigger> {
		assert.ok(this.kind === PseudoStateKind.Choice || this.kind === PseudoStateKind.Junction, () => `Else transitions are only valid at Choice and Junction pseudo states`);
		assert.ok(!this.elseTransition, () => `Only 1 else transition allowed at ${this}`);

		return this.elseTransition = new Transition<TTrigger>(this, target, TransitionKind.external, undefined, () => false);
	}

	/**
	 * Find a transition from the pseudo state for a given trigger event
	 * @param trigger The trigger event to use to look for viable transitions.
	 * @returns Returns a transition to traverse in response to the trigger event.
	 * @internal
	 */
	getTransition(trigger: any): Transition | undefined {
		let result = (this.kind !== PseudoStateKind.Choice ? super.getTransition(trigger) : this.getChoiceTransition(trigger)) || this.elseTransition;

		// validate we have something to return
		assert.ok(result, () => `Unable to find transition at ${this} for ${trigger}`);

		return result;
	}

	/**
	 * A specialisation of [[getTransition]] for choice pseudo states.
	 * @param trigger The trigger event to use to look for viable transitions.
	 * @returns Returns a transition to traverse in response to the trigger event.
	 * @internal
	 */
	getChoiceTransition(trigger: any): Transition | undefined {
		const transitions: Array<Transition> = [];

		// find all transitions that evaluate true
		for (let i = this.outgoing.length; i--;) {
			if (this.outgoing[i].evaluate(trigger)) {
				transitions.unshift(this.outgoing[i]);
			}
		}

		return transitions[random.get(transitions.length)];
	}

	/**
	 * Cascade the entry operation to child elements as required.
	 * @param instance The state machine instance.
	 * @param deepHistory True if deep history semantics are in force at the time of entry.
	 * @param trigger The trigger event that caused the entry operation.
	 * @internal
	 */
	enterTail(instance: Instance, deepHistory: boolean, trigger: any): void {
		// a pseudo state must always have a completion transition (junction pseudo state completion occurs within the traverse method above)
		if (this.kind !== PseudoStateKind.Junction) {
			this.accept(instance, deepHistory, trigger);
		}
	}
}
