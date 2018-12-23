import { ExternalTransitionActivation } from './ExternalTransitionActivation';
import { LocalTransitionActivation } from './LocalTransitionActivation';
import { InternalTransitionActivation } from './InternalTransitionActivation';
export declare enum TransitionKind {
    /**
     * An external transition is the default transition kind between any two vertices (states or pseudo states).
     * Upon traversal it will: exit the source vertex and any parent elements (vertex or region) up to, but not including the common ancestor of the source and target;
     * it will then perform and user defined transition behaviour;
     * finally, it will enter the target vertex, having first entered any parent elements below the common ancestor as needed.
     * If the source or target vertices are not leaf-level elements within the state machine hierarchy, the exit or entry operation will cascate to child elements as needed.
     */
    external = 0,
    /**
     * An internal transition does not cause a change of state; when traversed it only executes the user defined transition behaviour.
    */
    internal = 1,
    /**
     * A local transition is one where either the source or target is the common ancestor of both vertices.
     * Traversal is the same as an external transition but the common ancestor is not entered/exited.
     */
    local = 2
}
export declare namespace TransitionKind {
    /**
     * Map from transition kind to the transition activation strategies.
     */
    const map: (typeof ExternalTransitionActivation | typeof LocalTransitionActivation | typeof InternalTransitionActivation)[];
}
