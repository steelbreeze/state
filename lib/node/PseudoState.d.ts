import { PseudoStateKind } from './PseudoStateKind';
import { Region } from './Region';
import { Vertex } from './Vertex';
import { State, StateMachine, Visitor } from './state';
/** A [vertex]{@link Vertex} in a [state machine model]{@link StateMachine} that has the form of a [state]{@link State} but does not behave as a full [state]{@link State}; it is always transient; it may be the source or target of [transitions]{@link Transition} but has no entry or exit behavior. */
export declare class PseudoState extends Vertex {
    readonly kind: PseudoStateKind;
    /** Creates a new instance of the [[PseudoState]] class.
     * @param name The name of this [pseudo state]{@link PseudoState}.
     * @param parent The parent [element]{@link IElement} of this [pseudo state]{@link PseudoState}. If a [state]{@link State} or [state machine]{@link StateMachine} is specified, its [default region]{@link State.defaultRegion} used as the parent.
     * @param kind The semantics of this [pseudo state]{@link PseudoState}; see the members of the [pseudo state kind enumeration]{@link PseudoStateKind} for details.
     */
    constructor(name: string, parent: Region | State | StateMachine, kind?: PseudoStateKind);
    /** Accepts a [visitor]{@link Visitor} object.
     * @param visitor The [visitor]{@link Visitor} object.
     * @param args Any optional arguments to pass into the [visitor]{@link Visitor} object.
     */
    accept(visitor: Visitor, ...args: any[]): any;
}
