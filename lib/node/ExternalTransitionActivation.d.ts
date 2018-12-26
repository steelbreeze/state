import { Vertex } from './Vertex';
import { Instance } from './index';
import { TransitionActivation } from './TransitionActivation';
/**
 * Semantics of external transitions. Derives elements to exit and enter in advance using the lowest common ancestor rule.
 */
export declare class ExternalTransitionActivation implements TransitionActivation {
    private readonly toExit;
    private readonly toEnter;
    /**
     * Creates a new instance of the ExternalTransitionActivation class.
     * @param source The source vertex of the external transition.
     * @param target The target vertex of the external transition.
     */
    constructor(source: Vertex, target: Vertex);
    /**
     * Exits the source of the transition
     * @param instance The state machine instance.
     * @param deepHistory True if deep history semantics are in force at the time of exit.
     * @param trigger The trigger event that caused the exit operation.
     */
    exitSource(instance: Instance, deepHistory: boolean, trigger: any): void;
    /**
     * Exits the target of the transition
     * @param instance The state machine instance.
     * @param deepHistory True if deep history semantics are in force at the time of entry.
     * @param trigger The trigger event that caused the exit operation.
     */
    enterTarget(instance: Instance, deepHistory: boolean, trigger: any): void;
    /**
     * Returns the type of the transtiion.
     */
    toString(): string;
}
