import { Vertex } from './Vertex';
import { State, Instance } from './index';
import { TransitionActivation } from './TransitionActivation';

/**
 * Semantics of local transitions. Local transitions do not chance the active state configuration when traversed.
 * @hidden 
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

	exitSource(instance: Instance, deepHistory: boolean, trigger: any): void {
		// don't exit anything
	}

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
