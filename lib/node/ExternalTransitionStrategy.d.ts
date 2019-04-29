import { Vertex } from '.';
import { Transaction } from './Transaction';
import { TransitionStrategy } from './TransitionStrategy';
/**
 * Logic used to traverse external transitions.
 */
export declare class ExternalTransitionStrategy implements TransitionStrategy {
    private readonly toExit;
    private readonly toEnter;
    constructor(source: Vertex, target: Vertex);
    doExitSource(transaction: Transaction, history: boolean, trigger: any): void;
    doEnterTarget(transaction: Transaction, history: boolean, trigger: any): void;
    toString(): string;
}
