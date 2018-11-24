import { Vertex } from './Vertex';
/**
 * A transition between vertices that defines a valid change in state in response to an event.
 * @param TTrigger The type of triggering event that causes this transition to be traversed.
 */
export declare class Transition<TTrigger = any> {
    readonly source: Vertex;
    target: Vertex | undefined;
    private typeTest;
    private guard;
    /**
     * Creates an instance of the Transition class.
     * @param source The source [[Vertex]] of the transition.
     * @param type The type of triggering event that causes this transition to be traversed.
     * @public
     */
    constructor(source: Vertex);
    /**
     * Adds a predicate to the transition to ensure events must be of a certain event type for the transition to be traversed.
     * @param type The type of event to test for.
     * @return Returns the transition.
     * @public
     */
    on(type: new (...args: any[]) => TTrigger): this;
    /**
     * Adds a guard condition to the transition enabling event details to determine if the transition should be traversed.
     * @param type A boolean predicate taking the trigger event as a parameter.
     * @return Returns the transition.
     * @public
     */
    if(guard: (trigger: TTrigger) => boolean): this;
    /**
     * A pseudonym of [[Transition.if]].
     * @param type A boolean predicate taking the trigger event as a parameter.
     * @return Returns the transition.
     * @public
     * @deprecated Use Transition.if in its place. This method will be removed in the v8.0 release.
     */
    when(guard: (trigger: TTrigger) => boolean): this;
    /**
     * Specifies the target vertex, thereby making the transition an external transition.
     * @param target The target vertex of the transition
     * @return Returns the transition.
     * @public
     */
    to(target: Vertex): this;
    /**
     * Specifies the target vertex which is a child of the source and specify it as a local transition.
     * @param target The target vertex of the transition
     * @return Returns the transition.
     * @public
     */
    local(target?: Vertex | undefined): this;
    /**
     * Adds behaviour to the transition to be called every time the transition is traversed.
     * @remarks You may make multiple calls to this method to add more behaviour.
     * @param action The behaviour to call on transition traversal.
     * @returns Returns the transition.
     * @public
     * @deprecated Use Transition.do instead. This method will be removed in the v8.0 release.
     */
    do(action: (trigger: TTrigger) => any): this;
    /**
     * Adds behaviour to the transition to be called every time the transition is traversed.
     * @param action The behaviour to call on transition traversal.
     * @returns Returns the transition.
     * @public
     * @deprecated Use Transition.do instead. This method will be removed in the v8.0 release.
     */
    effect(action: (trigger: TTrigger) => void): this;
}
