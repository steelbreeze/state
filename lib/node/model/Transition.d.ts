import { func } from '../util';
import { NamedElement } from './NamedElement';
import { Vertex } from './Vertex';
/** Interface describing elements to leave and enter when traversing the transition; derived from the source and target using the TransitionType strategy. */
interface TransitionPath {
    leave: NamedElement | undefined;
    enter: Array<NamedElement>;
}
/** A prototype for functions that derive the TransitionPath; instances of which are used in the Transition class using a variant of the strategy pattern. */
declare type TransitionType = (source: Vertex, target: Vertex | undefined) => TransitionPath;
/** Determines the transition path for internal transitions. */
export declare function internal(source: Vertex, target: Vertex | undefined): TransitionPath;
/** Determines the transition path for external transitions. */
export declare function external(source: Vertex, target: Vertex | undefined): TransitionPath;
/** Determines the transition path for local transitions. */
export declare function local(source: Vertex, target: Vertex | undefined): TransitionPath;
/**
 * A transition between vertices that defines a valid change in state in response to an event.
 * @param TTrigger The type of triggering event that causes this transition to be traversed.
 */
export declare class Transition<TTrigger = any> {
    readonly source: Vertex;
    target: Vertex | undefined;
    /**
     * Creates an instance of the Transition class.
     * @param source The source [[Vertex]] of the transition.
     * @param type The type of triggering event that causes this transition to be traversed.
     * @public
     */
    constructor(source: Vertex, target?: Vertex | undefined, type?: TransitionType);
    /**
     * Adds a predicate to the transition to ensure events must be of a certain event type for the transition to be traversed.
     * @param type The type of event to test for.
     * @return Returns the transition.
     * @public
     */
    on(type: func.Constructor<TTrigger>): this;
    /**
     * Adds a guard condition to the transition enabling event details to determine if the transition should be traversed.
     * @param type A predicate taking the trigger event as a parameter.
     * @return Returns the transition.
     * @public
     */
    when(guard: func.Predicate<TTrigger>): this;
    /**
     * A pseudonym of [[Transition.when]].
     * @param type A predicate taking the trigger event as a parameter.
     * @return Returns the transition.
     * @public
     * @deprecated Use Transition.when in its place. This method will be removed in the v8.0 release.
     */
    if(guard: func.Predicate<TTrigger>): this;
    /**
     * Specifies the target vertex, thereby making the transition an external transition.
     * @param target The target vertex of the transition
     * @return Returns the transition.
     * @public
     */
    to(target: Vertex, type?: TransitionType): this;
    /**
     * Specifies the target vertex which is a child of the source and specify it as a local transition.
     * @param target The target vertex of the transition
     * @return Returns the transition.
     * @public
     * @deprecated Use the to method with the transition type of local
     */
    local(target?: Vertex | undefined): this;
    /**
     * Adds behaviour to the transition to be called every time the transition is traversed.
     * @remarks You may make multiple calls to this method to add more behaviour.
     * @param action The behaviour to call on transition traversal.
     * @returns Returns the transition.
     * @public
     */
    do(action: func.Consumer<TTrigger>): this;
    /**
     * Adds behaviour to the transition to be called every time the transition is traversed.
     * @param action The behaviour to call on transition traversal.
     * @returns Returns the transition.
     * @public
     * @deprecated Use Transition.do instead. This method will be removed in the v8.0 release.
     */
    effect(action: func.Consumer<TTrigger>): this;
}
export {};
