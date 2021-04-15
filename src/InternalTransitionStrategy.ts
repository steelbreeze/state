import { Vertex, State } from '.';
import { Transaction } from './Transaction';
import { TransitionStrategy } from './TransitionStrategy';

/**
 * Logic used to traverse internal transitions.
 * Internal transitions just execute transition traversal behaviour, then can trigger completion transitions.
 * @hidden
 */
export class InternalTransitionStrategy implements TransitionStrategy {
	/**
	 * Creates a new instance of the internal transaction strategy.
	 * Internal transitions just perform the transition behaviour and do not enter or exit states when traversed. 
	 */
	constructor(private readonly target: Vertex) {
	}

	/**
	 * Just call the transition behaviour in place of entering the source.
	 */
	doEnter(transaction: Transaction, deepHistory: boolean): void {
		if (this.target instanceof State) {
			this.target.completion(transaction, deepHistory);
		}
	}

	doExit(): void {
	}

	toString(): string {
		return "internal";
	}
}
