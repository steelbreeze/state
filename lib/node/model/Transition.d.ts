import { Vertex } from './Vertex';
/**
 * Common base class for the three types of transition.
 * @param TTrigger The type of the trigger event that may cause this transition to be traversed.
 * @abstract
 * @public
 */
export declare abstract class Transition<TTrigger = any> {
    readonly target: Vertex;
    private typeTest;
    /**
     * Creates a new instance of the TransitionBase class.
     * @param source The source vertex of the transition.
     * @param target The target vertex of the transition.
     * @protected
     */
    protected constructor(source: Vertex, target: Vertex);
    on(trigger: new (...args: any[]) => TTrigger): this;
    /**
     * Adds a guard condition to the transition that determines if the transition should be traversed.
     * @param predicate A callback predicate that takes the trigger as a parameter and returns a boolean.
     * @returns Returns the transition.
     * @public
     */
    if(predicate: (event: TTrigger) => boolean): this;
    /**
     * Adds behaviour to the transition to be called every time the transition is traversed.
     * @param action The behaviour to call on transition traversal.
     * @returns Returns the transition.
     * @public
     * @deprecated Use the do method instead.
     */
    do(action: (trigger: TTrigger) => void): this;
    /**
     * Adds behaviour to the transition to be called every time the transition is traversed.
     * @param action The behaviour to call on transition traversal.
     * @returns Returns the transition.
     * @public
     */
    effect(action: (trigger: TTrigger) => void): this;
    /**
     * Adds a guard condition to the transition that determines if the transition should be traversed given a trigger.
     * @param predicate A callback predicate that takes the trigger as a parameter and returns a boolean.
     * @returns Returns the transition.
     * @public
     * @deprecated
     */
    when(predicate: (event: TTrigger) => boolean): this;
}
