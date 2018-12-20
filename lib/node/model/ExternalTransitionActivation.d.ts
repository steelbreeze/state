import { TransitionActivation } from './TransitionActivation';
import { NamedElement } from './NamedElement';
import { Vertex } from './Vertex';
/** Semantics of external transitions. */
export declare class ExternalTransitionActivation implements TransitionActivation {
    readonly toExit: NamedElement;
    readonly toEnter: Array<NamedElement>;
    constructor(source: Vertex, target: Vertex | undefined);
    toString(): string;
}
