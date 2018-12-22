import { Vertex } from './Vertex';
import { TransitionActivation } from './TransitionActivation';
import { ExternalTransitionActivation } from './ExternalTransitionActivation';
import { LocalTransitionActivation } from './LocalTransitionActivation';
import { InternalTransitionActivation } from './InternalTransitionActivation';

/**
 * A transition's kind defines its precise semantics at runtime.
 * While a TransitionKind is a prototype for constructors of TransitionActivation objects, it should be used as an enumeration with the [[external]], [[local]] and [[internal]] constants.
 */
export interface TransitionKind {
	new (source: Vertex, target: Vertex): TransitionActivation;
}

export namespace TransitionKind {
	/**
	 * An external transition is the default transition kind between any two vertices (states or pseudo states).
	 * Upon traversal it will: exit the source vertex and any parent elements (vertex or region) up to, but not including the common ancestor of the source and target;
	 * it will then perform and user defined transition behaviour;
	 * finally, it will enter the target vertex, having first entered any parent elements below the common ancestor as needed.
	 * If the source or target vertices are not leaf-level elements within the state machine hierarchy, the exit or entry operation will cascate to child elements as needed.
	 */
	export const external: TransitionKind = ExternalTransitionActivation;

	/**
	 * An internal transition does not cause a change of state; when traversed it only executes the user defined transition behaviour.
	 */
	export const internal: TransitionKind = InternalTransitionActivation;

	/**
	 * A local transition is one where either the source or target is the common ancestor of both vertices.
	 * Traversal is the same as an external transition but the common ancestor is not entered/exited.
	 */
	export const local: TransitionKind = LocalTransitionActivation;
}
