import { NamedElement } from "./NamedElement";
import { Region } from './Region';
import { Transition } from './Transition';
import { IInstance } from './IInstance';
/**
 * A vertex is an element that can be the source or target of a transition.
 */
export declare abstract class Vertex extends NamedElement<Region | undefined> {
    protected constructor(name: string, parent: Region | undefined);
    isActive(instance: IInstance): boolean;
    getTransition(trigger: any): Transition | undefined;
    /** Accept a trigger and vertex: evaluate the guard conditions of the transitions and traverse if one evaluates true. */
    accept(instance: IInstance, deepHistory: boolean, trigger: any): boolean;
}
