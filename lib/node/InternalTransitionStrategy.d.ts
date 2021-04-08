import { Vertex } from '.';
import { Transaction } from './Transaction';
import { TransitionStrategy } from './TransitionStrategy';
/**
 * Logic used to traverse internal transitions.
 */
export declare class InternalTransitionStrategy implements TransitionStrategy {
    private readonly target;
    constructor(target: Vertex);
    doEnterTarget(transaction: Transaction, history: boolean): void;
    doExitSource(): void;
    toString(): string;
}
