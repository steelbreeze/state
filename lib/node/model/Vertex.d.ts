import { NamedElement } from "./NamedElement";
import { Region } from './Region';
import { Transition } from './Transition';
export interface Vertex extends NamedElement<Region | undefined> {
    outgoing: Array<Transition>;
}
