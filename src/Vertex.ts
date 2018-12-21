import { NamedElement } from "./NamedElement";
import { Region } from './Region';
import { Transition } from './Transition';
import { Instance } from './Instance';
/**
 * A vertex is an element that can be the source or target of a transition.
 */
export interface Vertex extends NamedElement<Region | undefined> {
	/**
	 * The set of outgoind transitions from the vertex.
	 */
	outgoing: Array<Transition>;

	getTransition<TTrigger = any>(trigger: TTrigger): Transition | undefined;
}

/** Accept a trigger and vertex: evaluate the guard conditions of the transitions and traverse if one evaluates true. */
export function accept(vertex: Vertex, instance: Instance, deepHistory: boolean, trigger: any): boolean {
	let result = false;

	const transition = vertex.getTransition(trigger);

	if (transition) {
		transition.traverse( instance, deepHistory, trigger);

		result = true;
	}

	return result;
}
