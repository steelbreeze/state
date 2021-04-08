import { Vertex } from '.';
import { Transaction } from './Transaction';
import { TransitionStrategy } from './TransitionStrategy';
/**
 * Logic used to traverse local transitions.
 */
export declare class LocalTransitionStrategy implements TransitionStrategy {
    private readonly target;
    vertexToEnter: Vertex | undefined;
    constructor(target: Vertex);
    doExitSource(transaction: Transaction, history: boolean, trigger: any): void;
    doEnterTarget(transaction: Transaction, history: boolean, trigger: any): void;
    toString(): string;
}
