import { TransitionKind, NamedElement, Region, Transition, Instance } from '.';
/**
 * Represents an element within a state machine model hierarchy that can be the source or target of a transition.
 * Vertices are contained within regions.
 */
export declare abstract class Vertex extends NamedElement {
    readonly parent: Region | undefined;
    /** The transitions originating from this vertex. */
    readonly outgoing: Array<Transition>;
    /**
     * Creates a new instance of the vertex class.
     * @param name The name of the vertex.
     * @param parent The parent region of this vertex.
     * @protected
     */
    protected constructor(name: string, parent: Region | undefined);
    /**
     * Creates a new transition at this vertex triggered by an event of a specific type.
     * @param TTrigger The type of the triggering event.
     * @param type The type (class name) of the triggering event.
     * @returns Returns a new typed transition. A typed transition being one whose guard condition and behaviour will accept a parameter of the same type specified.
     * @remarks The generic parameter TTrigger is not generally required as this will be
     */
    on<TTrigger>(type: new (...args: any[]) => TTrigger): Transition<TTrigger>;
    /**
     * Creates a new transition at this vertex with a guard condition.
     * @param TTrigger The type of the triggering event.
     * @param guard The guard condition to determine if the transition should be traversed.
     * @returns Returns a new transition; if TTrigger is specified, a typed transition will be returned.
     */
    when<TTrigger = any>(guard: (trigger: TTrigger) => boolean): Transition<TTrigger>;
    to(target: Vertex, kind?: TransitionKind): Transition<any>;
    isActive(instance: Instance): boolean;
    evaluate(instance: Instance, history: boolean, trigger: any): boolean;
    getTransition(instance: Instance, trigger: any): Transition | undefined;
    doEnterHead(instance: Instance, history: boolean, trigger: any, next: NamedElement | undefined): void;
}
