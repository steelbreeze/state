import { Vertex } from './Vertex';
import { TransitionPath } from './TransitionPath';
/**
 * A transition's kind determines its traverasal behaviour.
 * @remarks These functions implement strategies in a variant of the strategy pattern that uses just functions instead of classes.
 */
export declare namespace TransitionKind {
    /**
     * An external transition is the default transition kind between any two vertices (states or pseudo states).
     * Upon traversal it will: exit the source vertex and any parent elements (vertex or region) up to, but not including the common ancestor of the source and target;
     * it will then perform and user defined transition behaviour;
     * finally, it will enter the target vertex, having first entered any parent elements below the common ancestor as needed.
     * If the source or target vertices are not leaf-level elements within the state machine hierarchy, the exit or entry operation will cascate to child elements as needed.
     */
    function external(source: Vertex, target: Vertex | undefined): TransitionPath;
    /**
     * An internal transition does not cause a change of state; when traversed it only executes the user defined transition behaviour.
     */
    function internal(source: Vertex, target: Vertex | undefined): TransitionPath;
    /**
     * A local transition is one where either the source or target is the common ancestor of both vertices.
     * Traversal is the same as an external transition but the common ancestor is not entered/exited.
     */
    function local(source: Vertex, target: Vertex | undefined): TransitionPath;
}
