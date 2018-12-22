import { Vertex } from './Vertex';
import { Instance } from './index';
/**
 * Encapsulates the semantics of different transition types.
 * @hidden
 */
export interface TransitionActivation {
    exitSource(instance: Instance, deepHistory: boolean, trigger: any): void;
    enterTarget(instance: Instance, deepHistory: boolean, trigger: any): void;
    toString(): string;
}
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
