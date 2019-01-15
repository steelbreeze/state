import { NamedElement } from "./NamedElement";
import { Region } from './Region';
/**
 * A vertex is an element that can be the source or target of a transition.
 */
export interface Vertex extends NamedElement<Region | undefined> {
}
