import { NamedElement } from "./NamedElement";
import { Region } from './Region';
import { Transition } from './Transition';
import { IInstance } from './IInstance';

/**
 * A vertex is an element that can be the source or target of a transition.
 */
export abstract class Vertex extends NamedElement<Region | undefined> {
	/**
	 * The set of outgoind transitions from the vertex.
	 * @internal
	 */
	outgoing: Array<Transition> = [];

	isActive(instance: IInstance): boolean {
		return this.parent ? this.parent.parent.isActive(instance) && instance.getVertex(this.parent) === this : true;
	}

	/**
	 * Returns the transition to take given a trigger event.
	 * @param trigger The trigger event.
	 * @returns Returns the transition to take in response to the trigger, of undefined if none found.
	 * @throws Throws an Error exception if the state machine model is malformed. 
	 * @internal
	 */
	abstract getTransition<TTrigger = any>(trigger: TTrigger): Transition | undefined;

	/** Accept a trigger and vertex: evaluate the guard conditions of the transitions and traverse if one evaluates true. */
	accept(instance: IInstance, deepHistory: boolean, trigger: any): boolean {
		let result = false;

		const transition = this.getTransition(trigger);

		if (transition) {
			transition.traverse(instance, deepHistory, trigger);

			result = true;
		}

		return result;
	}
}
