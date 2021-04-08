import { TransitionKind, Region, Transition } from '.';
import { Constructor, Predicate } from './types';
/**
 * Represents an element within a state machine model hierarchy that can be the source or target of a transition.
 * Vertices are contained within regions.
 */
export declare abstract class Vertex {
    readonly name: string;
    /** The parent region of the vertex. */
    abstract parent: Region | undefined;
    /**
     * Creates a new instance of the vertex class.
     * @param name The name of the vertex.
     * @param parent The parent region of this vertex.
     */
    protected constructor(name: string);
    /**
     * Creates a new transition at this vertex triggered by an event of a specific type.
     * @param TTrigger The type of the triggering event; note that this can be derived from the type parameter.
     * @param type The type (class name) of the triggering event.
     * @returns Returns a new typed transition. A typed transition being one whose guard condition and behaviour will accept a parameter of the same type specified.
     */
    on<TTrigger>(type: Constructor<TTrigger>): Transition<TTrigger>;
    /**
     * Creates a new transition at this vertex with a guard condition.
     * @param TTrigger The type of the triggering event.
     * @param guard The guard condition to determine if the transition should be traversed.
     * @returns Returns a new transition; if TTrigger is specified, a typed transition will be returned.
     */
    when<TTrigger = any>(guard: Predicate<TTrigger>): Transition<TTrigger>;
    /**
     * Creates a new transition from this vertex to the target vertex.
     * @param TTrigger The type of the triggering event that the guard will evaluate.
     * @param target The target of the transition.
     * @param kind The kind of the transition, specifying its behaviour.
     * @returns Returns a new transition; if TTrigger is specified, a typed transition will be returned.
     */
    to<TTrigger = any>(target: Vertex, kind?: TransitionKind): Transition<any>;
    /**
     * Returns the element in string form; the fully qualified name of the element.
     */
    toString(): string;
}
