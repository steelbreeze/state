import { Vertex } from './Vertex';
import { Instance } from './index';
import { TransitionActivation } from './TransitionActivation';
/**
 * Semantics of external transitions. Derives elements to exit and enter in advance using the lowest common ancestor rule.
 * @hidden
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
    exitSource(instance: Instance, deepHistory: boolean, trigger: any): void;
    enterTarget(instance: Instance, deepHistory: boolean, trigger: any): void;
    /**
     * Returns the type of the transtiion.
     */
    toString(): string;
}
