import { func } from '../util';
import { Vertex } from './Vertex';
import { TransitionPath } from './TransitionPath';
/**
 * A transition between vertices that defines a valid change in state in response to an event.
 * @param TTrigger The type of triggering event that causes this transition to be traversed.
 */
export declare class Transition<TTrigger = any> {
    readonly source: Vertex;
    target: Vertex | undefined;
    /**
     * Creates an instance of the Transition class.
     * @param source The source vertex of the transition.
     * @param target The optional target vertex of the transition; leave undefined for internal transitions.
     * @param kind The optional kind of the transition: external, internal or local. If left blank, this will be external if a targed vertex is specified otherwise internal.
     * @param type The optional type of the trigger event that will cause this transition to be traversed. If left undefined any object or primative type will be considered.
     * @public
     */
    constructor(source: Vertex, target?: Vertex | undefined, kind?: (source: Vertex, taget: Vertex | undefined) => TransitionPath, type?: func.Constructor<TTrigger> | undefined, guard?: func.Predicate<TTrigger>);
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
     * Specifies the target vertex, thereby making the transition an external transition.
     * @param target The target vertex of the transition
     * @return Returns the transition.
     * @public
     */
    to(target: Vertex, type?: ((source: Vertex, target: Vertex) => TransitionPath)): this;
    /**
     * Adds behaviour to the transition to be called every time the transition is traversed.
     * @remarks You may make multiple calls to this method to add more behaviour.
     * @param action The behaviour to call on transition traversal.
     * @returns Returns the transition.
     * @public
     */
    do(action: func.Consumer<TTrigger>): this;
    doActions(trigger: TTrigger): void;
    /**
     * A pseudonym of [[Transition.when]].
     * @param type A predicate taking the trigger event as a parameter.
     * @return Returns the transition.
     * @public
     * @deprecated Use Transition.when in its place. This method will be removed in the v8.0 release.
     */
    if(guard: func.Predicate<TTrigger>): this;
    /**
     * Specifies the target vertex which is a child of the source and specify it as a local transition.
     * @param target The target vertex of the transition
     * @return Returns the transition.
     * @public
     * @deprecated Use the to method with the transition type of local
     */
    local(target?: Vertex | undefined): this;
    /**
     * A pseudonym of do.
     * @param action The behaviour to call on transition traversal.
     * @returns Returns the transition.
     * @public
     * @deprecated Use Transition.do instead. This method will be removed in the v8.0 release.
     */
    effect(action: func.Consumer<TTrigger>): this;
}
