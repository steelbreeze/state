import { random } from './random';
import { PseudoStateKind, Vertex, Region, State, Transition, Visitor } from '.';
import { Transaction } from './Transaction';
import { TransitionKind } from './TransitionKind';

/**
 * A pseudo state is a transient state within a region, once entered it will exit immediately.
 */
export class PseudoState extends Vertex {
	/** The parent region of the vertex. */
	public readonly parent: Region;

	/** The 'else' outgoing transition if this is a junction or choice pseudo state. */
	private elseTransition: Transition | undefined;

	/**
	 * Creates a new instance of the PseudoState class.
	 * @param name The name of the pseudo state.
	 * @param parent The parent region of the pseudo state; note that a state can also be used, in which case the default region of the state will become the pseudo states parent.
	 * @param kind The kind pseudo state which defines its behaviour and use.
	 */
	public constructor(name: string, parent: State | Region, public readonly kind: PseudoStateKind = PseudoStateKind.Initial) {
		super(name);
		this.parent = parent instanceof State ? parent.getDefaultRegion() : parent;

		this.parent.vertices.push(this);

		if (this.kind & PseudoStateKind.Starting) {
			this.parent.initial = this;
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
	 * Selects an outgoing transition from this pseudo state based on the trigger event.
	 * @param trigger The trigger event.
	 * @returns Returns a transition or undefined if none were found.
	 * @internal
	 * @hidden
	 */
	getTransition(trigger: any): Transition | undefined {
		const transition = this.kind & PseudoStateKind.Choice ? random(this.outgoing.filter(transition => transition.evaluate(trigger))) : super.getTransition(trigger);

		return transition || this.elseTransition;
	}

	/**
	 * Immediately exits the pseudo state on entry; note that for junction pseudo states, this is managed in Transition.traverse
	 * @param transaction The current transaction being executed.
	 * @param deepHistory Flag used to denote deep history semantics are in force at the time of entry.
	 * @param trigger The event that triggered the state transition.
	 * @internal
	 * @hidden
	 */
	doEnterTail(transaction: Transaction, deepHistory: boolean, trigger: any): void {
		if (!(this.kind & PseudoStateKind.Junction)) {
			this.evaluate(transaction, deepHistory, trigger);
		}
	}

	/**
	 * Accepts a visitor and calls back its visitPseudoState method.
	 * @param visitor The visitor to call back.
	 */
	public accept(visitor: Visitor): void {
		visitor.visitPseudoState(this);
		visitor.visitPseudoStateTail(this);
	}
}
