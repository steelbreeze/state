import { func } from '../util';
import { Vertex } from './Vertex';
import { PseudoStateKind } from './PseudoStateKind';
import { Region } from './Region';
import { State } from './State';
import { Transition } from './Transition';
/**
 * A pseudo state is a transient elemement within a state machine, once entered it will evaluate outgoing transitions and attempt to exit.
 * @public
 */
export declare class PseudoState implements Vertex {
    readonly name: string;
    readonly kind: PseudoStateKind;
    readonly parent: Region;
    /**
     * The fully qualified name of the vertex including its parent's qualified name.
     * @public
     */
    readonly qualifiedName: string;
    /**
     * Creates a new instance of the PseudoState class.
     * @param name The name of the pseudo state.
     * @param parent The parent region of the pseudo state; a state may also be specified in which case the state's default region will be used as the parent region.
     * @param kind The kind of pseudo state; this defines its behaviour and use. See PseudoStateKind for more information.
     * @public
     */
    constructor(name: string, parent: State | Region, kind?: PseudoStateKind);
    /**
     * Tests a pseudo state to see if is is a history pseudo state
     * @returns Returns true if the pseudo state is of the deep or shallow history kind
     */
    isHistory(): boolean;
    /**
     * Creates a new transition with a type test.
     * @remarks Once creates with the [[Vertex.on]] method, the transition can be enhanced using the fluent API calls of [[Transition.if]], [[Transition.to]]/[[Transition.local]] and [[Transition.do]].
     * @param type The type of event that this transition will look for.
     * @returns Returns the newly created transition.
     * @public
     */
    on<TTrigger>(type: func.Constructor<TTrigger>): Transition<TTrigger>;
    /**
     * Creates a new transition with a guard condition.
     * @param guard
     */
    when<TTrigger>(guard: func.Predicate<TTrigger>): Transition<TTrigger>;
    /**
     * Creates a new transition with a target vertex.
     * @remarks Once creates with the [[Vertex.tn]] method, the transition can be enhanced using the fluent API calls of [[Transition.on]] [[Transition.if]], [[Transition.local]] and [[Transition.do]]. If an event test is needed, create the transition with the [[on]] method.
     * @param to The target vertex of the transition.
     * @returns Returns the newly created transition.
     * @public
     */
    to<TTrigger>(target: Vertex): Transition<TTrigger>;
    /**
     * A pseudonym for [[PseudoState.to]] provided for backwards compatability.
     * @param to The target vertex of the transition.
     * @returns Returns the newly created transition.
     * @public
     * @deprecated Use [[PseudoState.to]]. This method will be removed in the v8.0 release.
     */
    external<TTrigger>(target: Vertex): Transition<TTrigger>;
    /**
     * Creates an else transition from Junction or Choice pseudo states.
     * @param to The target vertex of the transition.
     * @returns Returns the newly created transition.
     * @public
     */
    else<TTrigger>(target: Vertex): Transition<TTrigger>;
    /**
     * Returns the fully qualified name of the pseudo state.
     * @public
     */
    toString(): string;
}
