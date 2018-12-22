import { Vertex } from './Vertex';
import { Instance } from './index';
import { TransitionActivation } from './TransitionActivation';
/**
 * Semantics of local transitions. Local transitions do not chance the active state configuration when traversed.
 * @hidden
 */
export declare class InternalTransitionActivation implements TransitionActivation {
    private readonly source;
    /**
     * Creates a new instance of the InternalTransitionActivation class.
     * @param source The source vertex of the internal transition.
     * @param target The target vertex of the internal transition.
     */
    constructor(source: Vertex, target: Vertex);
    exitSource(instance: Instance, deepHistory: boolean, trigger: any): void;
    enterTarget(instance: Instance, deepHistory: boolean, trigger: any): void;
    /**
     * Returns the type of the transtiion.
     */
    toString(): string;
}
