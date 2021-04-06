import { TransitionKind, Vertex } from '.';
import { Behaviour, Predicate, Producer } from './types';
/**
 * A transition changes the active state configuration of a state machine by specifying the valid transitions between states and the trigger events that cause them to be traversed.
 * @param TTrigger The type of trigger event that this transition will respond to.
 */
export declare class Transition<TTrigger = any> {
    readonly source: Vertex;
    /**
     * The target vertex of the transition.
     */
    target: Vertex;
    /**
     * Adds an event type constraint to the transition; it will only be traversed if a trigger event of this type is evaluated.
     * @param eventType The type of trigger event that will cause this transition to be traversed.
     * @return Returns the transitions thereby allowing a fluent style transition construction.
     */
    on(eventType: Producer<TTrigger>): this;
    /**
     * Adds an guard condition to the transition; it will only be traversed if the guard condition evaluates true for a given trigger event.
     * @param guard A boolean predicate callback that takes the trigger event as a parameter.
     * @return Returns the transitions thereby allowing a fluent style transition construction.
     * @remarks It is recommended that this is used in conjunction with the on method, which will first test the type of the trigger event.
     */
    when(guard: Predicate<TTrigger>): this;
    /**
     * Specifies a target vertex of the transition and the semantics of the transition.
     * @param target The target vertex of the transition.
     * @param kind The kind of transition, defining the precise semantics of how the transition will impact the active state configuration.
     * @return Returns the transitions thereby allowing a fluent style transition construction.
     */
    to(target: Vertex, kind?: TransitionKind): this;
    /**
     * Adds user-defined behaviour to the transition that will be called after the source vertex has been exited and before the target vertex is entered.
     * @param actions The action, or actions to call with the trigger event as a parameter.
     * @return Returns the transitions thereby allowing a fluent style transition construction.
     */
    effect(...actions: Array<Behaviour<TTrigger>>): this;
    /**
     * Returns the transition in string form.
     */
    toString(): string;
}
