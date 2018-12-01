import { Vertex } from './Vertex';
import { TransitionPath } from './TransitionPath';
/**
 * A transition's kind determines its traverasal behaviour.
 * @remarks TransitionKind is an implementation of the strategy pattern.
 */
export interface TransitionKind {
    /**
     * Derives the path of elements to exit and enter when travesing a transition of a particular kind.
     * @param source The source vertex of the transition.
     * @param target The optional target vertex of the transition.
     * @returns Returns the path of element to exit and enter when traversing the transition.
     */
    getPath(source: Vertex, target: Vertex | undefined): TransitionPath;
}
export declare namespace TransitionKind {
    /**
     * An external transition is the default transition kind between any two vertices (states or pseudo states).
     * Upon traversal it will: exit the source vertex and any parent elements (vertex or region) up to, but not including the common ancestor of the source and target;
     * it will then perform and user defined transition behaviour;
     * finally, it will enter the target vertex, having first entered any parent elements below the common ancestor as needed.
     * If the source or target vertices are not leaf-level elements within the state machine hierarchy, the exit or entry operation will cascate to child elements as needed.
     */
    const external: TransitionKind;
    /**
     * An internal transition does not cause a change of state; when traversed it only executes the user defined transition behaviour.
     */
    const internal: TransitionKind;
    /**
     * A local transition is one where either the source or target is the common ancestor of both vertices.
     * Traversal is the same as an external transition but the common ancestor is not entered/exited.
     */
    const local: TransitionKind;
}
