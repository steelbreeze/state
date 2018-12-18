import { NamedElement } from './NamedElement';
import { Transition } from './Transition';
import { State } from './State';
/** Interface describing elements to leave and enter when traversing the transition; derived from the source and target using the TransitionType strategy. */
export interface TransitionActivation {
    toString(): string;
}
export declare class ExternalTransitionActivation implements TransitionActivation {
    readonly toExit: NamedElement;
    readonly toEnter: Array<NamedElement>;
    constructor(transition: Transition);
    toString(): string;
}
export declare class LocalTransitionActivation implements TransitionActivation {
    readonly source: State;
    readonly toEnter: Array<NamedElement>;
    constructor(transition: Transition);
    toString(): string;
}
export declare class InternalTransitionActivation implements TransitionActivation {
    readonly source: State;
    constructor(transition: Transition);
    toString(): string;
}
