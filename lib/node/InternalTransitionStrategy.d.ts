import { Vertex } from '.';
import { Transaction } from './Transaction';
import { TransitionStrategy } from './TransitionStrategy';
/**
 * Logic used to traverse internal transitions.
 * Internal transitions just execute transition traversal behaviour, then can trigger completion transitions.
 */
export declare class InternalTransitionStrategy implements TransitionStrategy {
    private readonly target;
    constructor(target: Vertex);
    doEnter(transaction: Transaction, deepHistory: boolean): void;
    doExit(): void;
    toString(): string;
}
