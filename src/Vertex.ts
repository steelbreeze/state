import { assert } from './util';
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

	protected constructor(name: string, parent: Region | undefined) {
		super(name, parent);

		if(this.parent) {
			this.parent.children.unshift(this);
		}
	}

	isActive(instance: IInstance): boolean {
		return this.parent ? this.parent.parent.isActive(instance) && instance.getVertex(this.parent) === this : true;
	}

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
