import { NamedElement } from "./NamedElement";
import { Transition, Instance } from './index';
/**
 * A vertex is an element that can be the source or target of a transition.
 */
export declare abstract class Vertex<TParent = any> extends NamedElement<TParent> {
    /**
     * The outgoing transitions available from this vertex.
     */
    outgoing: Array<Transition>;
    protected constructor(name: string, parent: TParent);
    /** Accept a trigger and vertex: evaluate the guard conditions of the transitions and traverse if one evaluates true. */
    accept(instance: Instance, deepHistory: boolean, trigger: any): boolean;
    /**
     * Find a transition from the state given a trigger event.
     * @param trigger The trigger event to evaluate transtions against.
     * @returns Returns the trigger or undefined if none are found.
     * @throws Throws an Error if more than one transition was found.
     */
    getTransition(trigger: any): Transition | undefined;
}
