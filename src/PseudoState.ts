import { random } from './random';
import { PseudoStateKind, Vertex, Region, State, Transition, Instance, Visitor } from '.';
import { TransitionKind } from './TransitionKind';

/**
 * A pseudo state is a transient state within a region, once entered it will exit immediately.
 */
export class PseudoState extends Vertex {
	/** The 'else' outgoing transition if this is a junction or choice pseudo state. */
	private elseTransition: Transition | undefined;

	public readonly isHistory: boolean;

	/**
	 * Creates a new instance of the PseudoState class.
	 * @param name The name of the pseudo state.
	 * @param parent The parent region of the pseudo state; note that a state can also be used, in which case the default region of the state will become the pseudo states parent.
	 * @param kind The kind pseudo state which defines its behaviour and use.
	 */
	public constructor(name: string, parent: State | Region, public readonly kind: PseudoStateKind = PseudoStateKind.Initial) {
		super(name, parent instanceof State ? parent.getDefaultRegion() : parent);

		this.isHistory = this.kind === PseudoStateKind.DeepHistory || this.kind === PseudoStateKind.ShallowHistory;

		if (this.kind === PseudoStateKind.Initial || this.isHistory) {
			this.parent!.initial = this;
		}
	}

	/**
	 * Creates an 'else' transition from this pseudo state, which will be chosen if no other outgoing transition is found.
	 * @param target The target of the transition.
	 * @param kind The kind of the transition, specifying its behaviour.
	 * @returns Returns a new untyped transition.
	 */
	public else(target: Vertex, kind: TransitionKind = TransitionKind.External): Transition<any> {
		return this.elseTransition = new Transition<any>(this).to(target, kind).when(() => false);
	}


	/**
	 * Tests a pseudo state to determine if it is a history pseudo state.
	 * @returns Returns true if the pseudo state is a history pseudo state.
	 * @internal
	 * @hidden
	 */
//	isHistory(): boolean {
//		return this.kind === PseudoStateKind.DeepHistory || this.kind === PseudoStateKind.ShallowHistory;
//	}

	/**
	 * Selects an outgoing transition from this pseudo state based on the trigger event.
	 * @param instance The state machine instance.
	 * @param trigger The trigger event.
	 * @returns Returns a transition or undefined if none were found.
	 * @internal
	 * @hidden
	 */
	getTransition(instance: Instance, trigger: any): Transition | undefined {
		const transition = this.kind === PseudoStateKind.Choice ? random.get(this.outgoing.filter(transition => transition.evaluate(trigger))) : super.getTransition(instance, trigger);

		return transition || this.elseTransition;
	}

	/**
	 * Immediately exits the pseudo state on entry; note that for junction pseudo states, this is managed in Transition.traverse
	 * @param instance The state machine instance that is entering the element.
	 * @param history Flag used to denote deep history semantics are in force at the time of entry.
	 * @param trigger The event that triggered the state transition.
	 * @internal
	 * @hidden
	 */
	doEnterTail(instance: Instance, history: boolean, trigger: any): void {
		if (this.kind !== PseudoStateKind.Junction) {
			this.evaluate(instance, history, trigger);
		}
	}

	/**
	 * Accepts a visitor and calls back its visitPseudoState method.
	 * @param visitor The visitor to call back.
	 */
	public accept(visitor: Visitor): void {
		visitor.visitPseudoStateHead(this);
		visitor.visitPseudoStateTail(this);
	}
}
