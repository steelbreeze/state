import { Vertex } from '.';
import { Transaction } from './Transaction';
import { TransitionStrategy } from './TransitionStrategy';
/**
 * Logic used to traverse external transitions.
 * @hidden
 */
export declare class ExternalTransitionStrategy implements TransitionStrategy {
    /** The element that will need to be exited when the transition is traversed. This is not necessarily the source of the transition, but the element beneath the least common ancestor of the source and target on the source side. */
    private readonly toExit;
    /** The elements that will need to be entered when the transition is traversed. */
    private readonly toEnter;
    /**
     * Creates a new instance of an external transition strategy; this determines the entry and exit actions that will be called when the transition is traversed.
     * @param source The source vertex of the transition.
     * @param target The target vertex of the transition.
     */
    constructor(source: Vertex, target: Vertex);
    doExit(transaction: Transaction, deepHistory: boolean, trigger: any): void;
    doEnter(transaction: Transaction, deepHistory: boolean, trigger: any): void;
    toString(): string;
}
