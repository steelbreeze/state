import { Vertex } from './Vertex';
import { State, Instance } from './index';
import { TransitionActivation } from './TransitionActivation';

/**
 * Semantics of local transitions. Local transitions do not chance the active state configuration when traversed.
 */
export class InternalTransitionActivation implements TransitionActivation {
	private readonly source: State;

	/**
	 * Creates a new instance of the InternalTransitionActivation class.
	 * @param source The source vertex of the internal transition.
	 * @param target The target vertex of the internal transition.
	 */
	constructor(source: Vertex, target: Vertex) {
		if (source instanceof State) {
			this.source = source;
		} else {
			throw new Error(`Source of local transition must be a State.`);
		}
	}

	/**
	 * Exits the source of the transition
	 * @param instance The state machine instance.
	 * @param deepHistory True if deep history semantics are in force at the time of exit.
	 * @param trigger The trigger event that caused the exit operation.
	 */
	exitSource(instance: Instance, deepHistory: boolean, trigger: any): void {
		// don't exit anything
	}

	/**
	 * Exits the target of the transition
	 * @param instance The state machine instance.
	 * @param deepHistory True if deep history semantics are in force at the time of entry.
	 * @param trigger The trigger event that caused the exit operation.
	 */
	enterTarget(instance: Instance, deepHistory: boolean, trigger: any): void {
		// test for completion transitions for internal transitions as there will be state entry/exit performed where the test is usually performed
		this.source.completion(instance, deepHistory, this.source);
	}

	/**
	 * Returns the type of the transtiion.
	 */
	public toString(): string {
		return "internal";
	}
}
