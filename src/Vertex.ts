import { assert } from './util';
import { NamedElement } from "./NamedElement";
import { Transition, Instance } from './index';

/**
 * A vertex is an element that can be the source or target of a transition.
 */
export abstract class Vertex<TParent = any> extends NamedElement<TParent> {
	/**
	 * The outgoing transitions available from this vertex.
	 */
	public outgoing: Array<Transition> = [];

	protected constructor(name: string, parent: TParent) {
		super(name, parent);
	}

	/** Accept a trigger and vertex: evaluate the guard conditions of the transitions and traverse if one evaluates true. */
	accept(instance: Instance, deepHistory: boolean, trigger: any): boolean {
		let result = false;

		const transition = this.getTransition(trigger);

		if (transition) {
			transition.traverse(instance, deepHistory, trigger);

			result = true;
		}

		return result;
	}
	/**
	 * Find a transition from the state given a trigger event.
	 * @param trigger The trigger event to evaluate transtions against.
	 * @returns Returns the trigger or undefined if none are found.
	 * @throws Throws an Error if more than one transition was found.
	 */
	getTransition(trigger: any): Transition | undefined {
		let result: Transition | undefined;

		// iterate through all outgoing transitions of this state looking for a single one whose guard evaluates true
		for (let i = this.outgoing.length; i--;) {
			if (this.outgoing[i].evaluate(trigger)) {
				assert.ok(!result, () => `Multiple transitions found at ${this} for ${trigger}`);

				result = this.outgoing[i];
			}
		}

		return result;
	}
}