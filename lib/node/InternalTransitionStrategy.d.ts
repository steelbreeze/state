import { Vertex } from '.';
import { Transaction } from './Transaction';
import { TransitionStrategy } from './TransitionStrategy';
/**
 * Logic used to traverse internal transitions.
 * Internal transitions just execute transition traversal behaviour, then can trigger completion transitions.
 * @hidden
 */
export declare class InternalTransitionStrategy implements TransitionStrategy {
    private readonly target;
    /**
     * Creates a new instance of the internal transaction strategy.
     * Internal transitions just perform the transition behaviour and do not enter or exit states when traversed.
     */
    constructor(target: Vertex);
    /**
     * Just call the transition behaviour in place of entering the source.
     */
    doEnter(transaction: Transaction, deepHistory: boolean): void;
    doExit(): void;
    toString(): string;
}
