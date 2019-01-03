import { func, assert, log, random } from '../util';
import { Vertex } from './Vertex';
import { PseudoStateKind } from './PseudoStateKind';
import { Region } from './Region';
import { State } from './State';
import { Transition } from './Transition';
import { TransitionKind } from './TransitionKind';


/**
 * A pseudo state is a transient elemement within a state machine, once entered it will evaluate outgoing transitions and attempt to exit.
 * @public
 */
export class PseudoState implements Vertex {
	public readonly parent: Region;

	/**
	 * The fully qualified name of the vertex including its parent's qualified name.
	 * @public
	 */
	public readonly qualifiedName: string;

	/**
	 * The outgoing transitions available from this vertex.
	 * @internal
	 */
	outgoing: Array<Transition> = [];

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
	 * @public
	 */
	public constructor(public readonly name: string, parent: State | Region, public readonly kind: PseudoStateKind = PseudoStateKind.Initial) {
		this.parent = parent instanceof State ? parent.getDefaultRegion() : parent;
		this.qualifiedName = `${this.parent}.${this.name}`;

		// if this is a starting state (initial, deep or shallow history), record it against the parent region
		if (this.kind === PseudoStateKind.Initial || this.isHistory()) {
			assert.ok(!this.parent.starting, () => `Only one initial pseudo state is allowed in region ${this.parent}`);

			this.parent.starting = this;
		}

		this.parent.children.unshift(this);

		log.info(() => `Created ${this.kind} pseudo state ${this}`, log.Create);
	}

	/**
	 * Tests a pseudo state to see if is is a history pseudo state
	 * @returns Returns true if the pseudo state is of the deep or shallow history kind
	 */
	isHistory(): boolean {
		return this.kind === PseudoStateKind.DeepHistory || this.kind === PseudoStateKind.ShallowHistory;
	}

	/**
	 * Creates a new transition with a type test.
	 * @remarks Once creates with the [[Vertex.on]] method, the transition can be enhanced using the fluent API calls of [[Transition.if]], [[Transition.to]]/[[Transition.local]] and [[Transition.do]].
	 * @param type The type of event that this transition will look for.
	 * @returns Returns the newly created transition.
	 * @public
	 */
	public on<TTrigger>(type: func.Constructor<TTrigger>): Transition<TTrigger> {
		return new Transition<TTrigger>(this, undefined, TransitionKind.internal, type);
	}

	/**
	 * Creates a new transition with a guard condition.
	 * @param guard 
	 */
	public when<TTrigger>(guard: func.Predicate<TTrigger>): Transition<TTrigger> {
		return new Transition<TTrigger>(this, undefined, TransitionKind.internal, undefined, guard);
	}

	/**
	 * Creates a new transition with a target vertex.
	 * @remarks Once creates with the [[Vertex.tn]] method, the transition can be enhanced using the fluent API calls of [[Transition.on]] [[Transition.if]], [[Transition.local]] and [[Transition.do]]. If an event test is needed, create the transition with the [[on]] method.
	 * @param to The target vertex of the transition.
	 * @returns Returns the newly created transition.
	 * @public
	 */
	public to<TTrigger>(target: Vertex): Transition<TTrigger> {
		return new Transition<TTrigger>(this, target);
	}

	/**
	 * A pseudonym for [[PseudoState.to]] provided for backwards compatability.
	 * @param to The target vertex of the transition.
	 * @returns Returns the newly created transition.
	 * @public
	 * @deprecated Use [[PseudoState.to]]. This method will be removed in the v8.0 release.
	 */
	public external<TTrigger>(target: Vertex): Transition<TTrigger> {
		return this.to(target);
	}

	/**
	 * Creates an else transition from Junction or Choice pseudo states.
	 * @param to The target vertex of the transition.
	 * @returns Returns the newly created transition.
	 * @public
	 */
	public else<TTrigger>(target: Vertex): Transition<TTrigger> {
		assert.ok(this.kind === PseudoStateKind.Choice || this.kind === PseudoStateKind.Junction, () => `Else transitions are only valid at Choice and Junction pseudo states`);
		assert.ok(!this.elseTransition, () => `Only 1 else transition allowed at ${this}`);

		return this.elseTransition = new Transition<TTrigger>(this, target, TransitionKind.external, undefined, () => false);
	}

	/**
	 * Returns the transition to take given a trigger event.
	 * @param trigger The trigger event.
	 * @returns Returns the transition to take in response to the trigger.
	 * @throws Throws an Error if the state machine model is ill defined.
	 * @internal
	 */
	getTransition(trigger: any): Transition  {
		let result = this.kind === PseudoStateKind.Choice ? this.getChoiceTransition(trigger) : this.getOtherTransition(trigger);

		if(!result) {
			throw new Error (`No outgoing transition found at ${this}`);
		}

		return result;
	}

	/**
	 * Returns the transition to take given a trigger event at choice pseudo states.
	 * @param trigger The trigger event.
	 * @returns Returns the transition to take in response to the trigger.
	 * @internal
	 */
	getChoiceTransition(trigger: any): Transition | undefined {
		const results: Array<Transition> = [];

		for (let i = this.outgoing.length; i--;) {
			if (this.outgoing[i].evaluate(trigger)) {
				results.push(this.outgoing[i]);
			}
		}

		return results[random.get(results.length)] || this.elseTransition;
	}

	/**
	 * Returns the transition to take given a trigger event at non-choice pseudo ststes.
	 * @param trigger The trigger event.
	 * @returns Returns the transition to take in response to the trigger.
	 * @internal
	 */
	getOtherTransition(trigger: any): Transition | undefined {
		let result: Transition | undefined;

		for (let i = this.outgoing.length; i--;) {
			if (this.outgoing[i].evaluate(trigger)) {
				result = this.outgoing[i];
			}
		}

		return result || this.elseTransition;
	}

	/**
	 * Returns the fully qualified name of the pseudo state.
	 * @public
	 */
	public toString(): string {
		return this.qualifiedName;
	}
}
