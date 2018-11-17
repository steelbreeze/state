import { Vertex } from './Vertex';
/**
 * Common base class for the three types of transition.
 * @param TTrigger The type of the trigger event that may cause this transition to be traversed.
 * @abstract
 * @public
 */
export declare abstract class Transition<TTrigger = any> {
    readonly target: Vertex;
    /**
     * Creates a new instance of the TransitionBase class.
     * @param source The source vertex of the transition.
     * @param target The target vertex of the transition.
     * @protected
     */
    protected constructor(source: Vertex, target: Vertex);
    /**
     * Adds behaviour to the transition to be called every time the transition is traversed.
     * @param action The behaviour to call on transition traversal.
     * @returns Returns the transition.
     * @public
     */
    effect(action: (trigger: TTrigger) => void): this;
    /**
     * Adds a guard condition to the transition that determines if the transition should be traversed given a trigger.
     * @param guard A callback predicate that takes the trigger as a parameter and returns a boolean.
     * @returns Returns the transition.
     * @public
     */
    when(guard: (trigger: TTrigger) => boolean): this;
}
