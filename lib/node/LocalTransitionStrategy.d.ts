import { Vertex } from '.';
import { Transaction } from './Transaction';
import { TransitionStrategy } from './TransitionStrategy';
/**
 * Logic used to traverse local transitions.
 * @hidden
 */
export declare class LocalTransitionStrategy implements TransitionStrategy {
    private readonly target;
    vertexToEnter: Vertex | undefined;
    constructor(target: Vertex);
    /**
     * Leave the source of the transition as needed
     */
    doExit(transaction: Transaction, deepHistory: boolean, trigger: any): void;
    doEnter(transaction: Transaction, deepHistory: boolean, trigger: any): void;
    toString(): string;
}
