import { Vertex } from '.';
import { Transaction } from './Transaction';
import { TransitionStrategy } from './TransitionStrategy';
/**
 * Logic used to traverse internal transitions.
 */
export declare class InternalTransitionStrategy implements TransitionStrategy {
    private readonly target;
    constructor(source: Vertex, target: Vertex);
    doEnterTarget(transaction: Transaction, history: boolean, trigger: any): void;
    doExitSource(transaction: Transaction, history: boolean, trigger: any): void;
    toString(): string;
}
