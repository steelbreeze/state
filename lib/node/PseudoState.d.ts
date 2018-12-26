import { func } from './util';
import { PseudoStateKind, State, Region, Transition } from './index';
import { Vertex } from './Vertex';
/**
 * A pseudo state is a transient elemement within a state machine, once entered it will evaluate outgoing transitions and attempt to exit.
 * @public
 */
export declare class PseudoState extends Vertex {
    readonly name: string;
    readonly kind: PseudoStateKind;
    /**
     * Creates a new instance of the PseudoState class.
     * @param name The name of the pseudo state.
     * @param parent The parent region of the pseudo state; a state may also be specified in which case the state's default region will be used as the parent region.
     * @param kind The kind of pseudo state; this defines its behaviour and use. See PseudoStateKind for more information.
     */
    constructor(name: string, parent: State | Region, kind?: PseudoStateKind);
    /**
     * Tests a pseudo state to see if is is a history pseudo state
     * @returns Returns true if the pseudo state is of the deep or shallow history kind
     */
    isHistory(): boolean;
    /**
     * Creates a new transition with a type test.
     * @remarks Once creates with the [[Vertex.on]] method, the transition can be enhanced using the fluent API calls of [[Transition.when]], [[Transition.to]] and [[Transition.do]].
     * @param type The type of event that this transition will look for.
     * @returns Returns the newly created transition.
     */
    on<TTrigger>(type: func.Constructor<TTrigger>): Transition<TTrigger>;
    /**
     * Adds a user-defined guard condition that allows to further restricts the conditions under which a transition may be traversed.
     * @param guard The guard condition that takes the triggering event as a parameter and returns a boolean.
     */
    when<TTrigger>(guard: func.Predicate<TTrigger>): Transition<TTrigger>;
    /**
     * Creates a new external transition with a target vertex.
     * @remarks Once creates with the [[Vertex.tn]] method, the transition can be enhanced using the fluent API calls of [[Transition.on]] [[Transition.if]], [[Transition.local]] and [[Transition.do]]. If an event test is needed, create the transition with the [[on]] method.
     * @param to The target vertex of the transition.
     * @returns Returns the newly created transition.
     */
    to<TTrigger>(target: Vertex): Transition<TTrigger>;
    /**
     * Creates an else transition from Junction or Choice pseudo states.
     * @param to The target vertex of the transition.
     * @returns Returns the newly created transition.
     */
    else<TTrigger>(target: Vertex): Transition<TTrigger>;
}
