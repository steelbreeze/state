import { Vertex, State } from '.';
import { Transaction } from './Transaction';
import { TransitionStrategy } from './TransitionStrategy';

/**
 * Logic used to traverse internal transitions.
 * Internal transitions just execute transition traversal behaviour, then can trigger completion transitions.
 */
export class InternalTransitionStrategy implements TransitionStrategy {
	constructor(private readonly target: Vertex) {
	}

	doEnterTarget(transaction: Transaction, deepHistory: boolean): void {
		if (this.target instanceof State) {
			this.target.completion(transaction, deepHistory);
		}
	}

	doExitSource(): void {
	}

	toString(): string {
		return "internal";
	}
}
