import { Vertex } from './Vertex';
import { Instance } from './index';
import { TransitionActivation } from './TransitionActivation';
/**
 * Semantics of local transitions. The elements to exit and enter when traversing a local transition  depend on the active state configuration at the time of traversal.
 */
export declare class LocalTransitionActivation implements TransitionActivation {
    readonly target: Vertex;
    private toEnter;
    /**
     * Creates a new instance of the LocalTransitionActivation class.
     * @param source The source vertex of the local transition.
     * @param target The target vertex of the local transition.
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
