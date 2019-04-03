import { PseudoStateKind, Vertex, Region, State, Transition, Instance, Visitor } from '.';
import { TransitionKind } from './TransitionKind';
/**
 * A pseudo state is a transient state within a region, once entered it will exit immediately.
 */
export declare class PseudoState extends Vertex {
    readonly kind: PseudoStateKind;
    /** The 'else' outgoing transition if this is a junction or choice pseudo state. */
    private elseTransition;
    /**
     * Creates a new instance of the PseudoState class.
     * @param name The name of the pseudo state.
     * @param parent The parent region of the pseudo state; note that a state can also be used, in which case the default region of the state will become the pseudo states parent.
     * @param kind The kind pseudo state which defines its behaviour and use.
     */
    constructor(name: string, parent: State | Region, kind?: PseudoStateKind);
    /**
     * Creates an 'else' transition from this pseudo state, which will be chosen if no other outgoing transition is found.
     * @param target The target of the transition.
     * @param kind The kind of the transition, specifying its behaviour.
     * @returns Returns a new untyped transition.
     */
    else(target: Vertex, kind?: TransitionKind): Transition<any>;
    /**
     * Accepts a visitor and calls back its visitPseudoState method.
     * @param visitor The visitor to call back.
     * @param instance The optional state machine instance.
     */
    accept(visitor: Visitor, instance: Instance | undefined): void;
}
