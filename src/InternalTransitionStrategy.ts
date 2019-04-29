import { Vertex, State, Transaction } from '.';
import { TransitionStrategy } from './TransitionStrategy';

/**
 * Logic used to traverse internal transitions.
 */
export class InternalTransitionStrategy implements TransitionStrategy {
	constructor(source: Vertex, private readonly target: Vertex) {
	}

	doEnterTarget(transaction: Transaction, history: boolean, trigger: any): void {
		if (this.target instanceof State) {
			this.target.completion(transaction, history);
		}
	}

	doExitSource(transaction: Transaction, history: boolean, trigger: any): void {
	}

	toString(): string {
		return "internal";
	}
}
