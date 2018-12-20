import { NamedElement } from './NamedElement';
import { Vertex } from './Vertex';
import { State } from './State';
/** Encapsulates the semantics of different transition types. */
export interface TransitionActivation {
    toString(): string;
}
/** Semantics of external transitions. */
export declare class ExternalTransitionActivation implements TransitionActivation {
    readonly toExit: NamedElement;
    readonly toEnter: Array<NamedElement>;
    constructor(source: Vertex, target: Vertex | undefined);
    toString(): string;
}
/** Semantics of local transitions. */
export declare class LocalTransitionActivation implements TransitionActivation {
    readonly target: Vertex;
    vertexToEnter: Vertex | undefined;
    constructor(source: Vertex, target: Vertex | undefined);
    toString(): string;
}
/** Semantics of internal transitions. */
export declare class InternalTransitionActivation implements TransitionActivation {
    readonly source: State;
    constructor(source: Vertex);
    toString(): string;
}
