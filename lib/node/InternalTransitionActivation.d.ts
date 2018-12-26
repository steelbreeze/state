import { Vertex } from './Vertex';
import { Instance } from './index';
import { TransitionActivation } from './TransitionActivation';
/**
 * Semantics of local transitions. Local transitions do not chance the active state configuration when traversed.
 */
export declare class InternalTransitionActivation implements TransitionActivation {
    private readonly source;
    /**
     * Creates a new instance of the InternalTransitionActivation class.
     * @param source The source vertex of the internal transition.
     * @param target The target vertex of the internal transition.
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
