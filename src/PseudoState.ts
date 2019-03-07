import { func, assert, random } from './util';
import { NamedElement } from './NamedElement';
import { Vertex } from './Vertex';
import { PseudoStateKind } from './PseudoStateKind';
import { Region } from './Region';
import { State } from './State';
import { Transition } from './Transition';
import { TransitionKind } from './TransitionKind';
import { IInstance } from './IInstance';


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
	 * @public
	 */
	public constructor(name: string, parent: State | Region, public readonly kind: PseudoStateKind = PseudoStateKind.Initial) {
		super(name, parent instanceof State ? parent.getDefaultRegion() : parent);

		// if this is a starting state (initial, deep or shallow history), record it against the parent region
		if (this.kind === PseudoStateKind.Initial || this.isHistory()) {
			assert.ok(!this.parent!.starting, () => `Only one initial pseudo state is allowed in region ${this.parent}`);

			this.parent!.starting = this;
		}
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

	getTransition(trigger: any): Transition {
		const result = (this.kind === PseudoStateKind.Choice ? this.getChoiceTransition(trigger) : super.getTransition(trigger)) || this.elseTransition;

		if (!result) {
			throw new Error(`No outgoing transition found at ${this}`);
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

		return results[random.get(results.length)];
	}

	/** Initiate pseudo state entry */
	enterHead(instance: IInstance, deepHistory: boolean, trigger: any, nextElement: NamedElement | undefined): void {
		super.enterHead(instance, deepHistory, trigger, nextElement);

		// update the current vertex of the parent region
		instance.setVertex(this);
	}

	/** Complete pseudo state entry */
	enterTail(instance: IInstance, deepHistory: boolean, trigger: any): void {
		// a pseudo state must always have a completion transition (junction pseudo state completion occurs within the traverse method above)
		if (this.kind !== PseudoStateKind.Junction) {
			this.accept(instance, deepHistory, trigger);
		}
	}
}
