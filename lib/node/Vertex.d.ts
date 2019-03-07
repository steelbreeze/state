import { NamedElement } from "./NamedElement";
import { Region } from './Region';
import { IInstance } from './IInstance';
/**
 * A vertex is an element that can be the source or target of a transition.
 */
export declare abstract class Vertex extends NamedElement<Region | undefined> {
    isActive(instance: IInstance): boolean;
    /** Accept a trigger and vertex: evaluate the guard conditions of the transitions and traverse if one evaluates true. */
    accept(instance: IInstance, deepHistory: boolean, trigger: any): boolean;
}
