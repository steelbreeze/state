import { types, TransitionKind, NamedElement, Region, Transition, Instance } from '.';
/**
 * Represents an element within a state machine model hierarchy that can be the source or target of a transition.
 * Vertices are contained within regions.
 */
export declare abstract class Vertex extends NamedElement {
    readonly parent: Region | undefined;
    /**
     * The transitions originating from this vertex.
     */
    readonly outgoing: Array<Transition>;
    /**
     * Creates a new instance of the vertex class.
     * @param name The name of the vertex.
     * @param parent The parent region of this vertex.
     */
    protected constructor(name: string, parent: Region | undefined);
    /**
     * Creates a new transition at this vertex triggered by an event of a specific type.
     * @param TTrigger The type of the triggering event.
     * @param type The type (class name) of the triggering event.
     * @returns Returns a new typed transition. A typed transition being one whose guard condition and behaviour will accept a parameter of the same type specified.
     * @remarks The generic parameter TTrigger is not generally required as this will be
     */
    on<TTrigger>(type: types.Constructor<TTrigger>): Transition<TTrigger>;
    /**
     * Creates a new transition at this vertex with a guard condition.
     * @param TTrigger The type of the triggering event.
     * @param guard The guard condition to determine if the transition should be traversed.
     * @returns Returns a new transition; if TTrigger is specified, a typed transition will be returned.
     */
    when<TTrigger = any>(guard: types.Predicate<TTrigger>): Transition<TTrigger>;
    /**
     * Creates a new transition from this vertex to the target vertex.
     * @param TTrigger The type of the triggering event that the guard will evaluate.
     * @param target The target of the transition.
     * @param kind The kind of the transition, specifying its behaviour.
     * @returns Returns a new transition; if TTrigger is specified, a typed transition will be returned.
     */
    to<TTrigger = any>(target: Vertex, kind?: TransitionKind): Transition<any>;
    /**
     * Tests the vertex to see if it is current part of the state machine instances active state configuration.
     * @param instance The instance to test.
     * @returns Returns true if this vertex is active in the specified instance.
     */
    isActive(instance: Instance): boolean;
}
