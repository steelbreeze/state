import { NamedElement } from "./NamedElement";
import { Region } from './Region';
import { Transition } from './Transition';

/**
 * A vertex is an element that can be the source or target of a transition.
 */
export interface Vertex extends NamedElement<Region | undefined> {
	/**
	 * The set of outgoind transitions from the vertex.
	 * @internal
	 */
	outgoing: Array<Transition>;

	/**
	 * Returns the transition to take given a trigger event.
	 * @param trigger The trigger event.
	 * @returns Returns the transition to take in response to the trigger, of undefined if none found.
	 * @throws Throws an Error exception if the state machine model is malformed. 
	 * @internal
	 */
	getTransition<TTrigger = any>(trigger: TTrigger): Transition | undefined;
}