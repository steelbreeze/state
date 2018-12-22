import { Vertex } from './Vertex';
import { Instance } from './index';
import { TransitionActivation } from './TransitionActivation';
/**
 * Semantics of local transitions. The elements to exit and enter when traversing a local transition  depend on the active state configuration at the time of traversal.
 * @hidden
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
    exitSource(instance: Instance, deepHistory: boolean, trigger: any): void;
    enterTarget(instance: Instance, deepHistory: boolean, trigger: any): void;
    /**
     * Returns the type of the transtiion.
     */
    toString(): string;
}
