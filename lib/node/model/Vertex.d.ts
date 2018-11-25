import { NamedElement } from "./NamedElement";
import { Region } from './Region';
import { Transition } from './Transition';
/**
 * A vertex is an element that can be the source or target of a transition.
 */
export interface Vertex extends NamedElement<Region | undefined> {
    /**
     * The set of outgoind transitions from the vertex.
     */
    outgoing: Array<Transition>;
}
