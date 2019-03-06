import { NamedElement } from "./NamedElement";
import { Region } from './Region';
import { Transition } from './Transition';
import {IInstance} from './IInstance';

/**
 * A vertex is an element that can be the source or target of a transition.
 */
export abstract class Vertex implements NamedElement<Region | undefined> {
	/**
	 * The fully qualified name of the vertex including its parent's qualified name.
	 * @public
	 */
	public readonly qualifiedName: string;

	/**
	 * The set of outgoind transitions from the vertex.
	 * @internal
	 */
	outgoing: Array<Transition> = [];

	protected constructor(public readonly name: string, public readonly parent: Region | undefined) {
		this.qualifiedName = parent ? `${this.parent}.${name}` : name;
	}

	isActive(instance: IInstance): boolean {
		return this.parent ? this.parent.parent.isActive( instance) && instance.getVertex(this.parent) === this : true;
	}


	/**
	 * Returns the transition to take given a trigger event.
	 * @param trigger The trigger event.
	 * @returns Returns the transition to take in response to the trigger, of undefined if none found.
	 * @throws Throws an Error exception if the state machine model is malformed. 
	 * @internal
	 */
	abstract getTransition<TTrigger = any>(trigger: TTrigger): Transition | undefined;

	enter(instance: IInstance, deepHistory: boolean, trigger: any): void {
		this.enterHead(instance, deepHistory, trigger, undefined);
		this.enterTail(instance, deepHistory, trigger);
	}


	abstract enterHead(instance: IInstance, deepHistory: boolean, trigger: any, nextElement: NamedElement | undefined): void;
	abstract enterTail(instance: IInstance, deepHistory: boolean, trigger: any): void;
	abstract leave(instance: IInstance, deepHistory: boolean, trigger: any): void;
 
}
