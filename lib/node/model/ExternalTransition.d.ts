import { Vertex } from './Vertex';
import { Transition } from './Transition';
/**
 * An external transition is the default transition type within a state machine, enabling transitions between any pair of vertices.
 * @param TTrigger The type of the trigger event that may cause this transition to be traversed.
 * @public
 */
export declare class ExternalTransition<TTrigger = any> extends Transition<TTrigger> {
    readonly source: Vertex;
    /**
     * Creates a new instance of the ExternalTransition class.
     * @param TTrigger The type of the trigger that will cause this transition to be traversed.
     * @param source The source vertex to exit when the transition fires.
     * @param target The target vertex to enter when the transition fires.
     * @summary An external transition, when traversed will:
     * exit all elements from the element below the common ancestor of the source and target to the source;
     * perform the transition behaviour;
     * enter all elements from the element below the common ancestor of the source and target to the target.
     * @public
     */
    constructor(source: Vertex, target: Vertex);
}
