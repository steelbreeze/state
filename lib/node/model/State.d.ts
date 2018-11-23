import { Vertex } from './Vertex';
import { Region } from './Region';
import { Transition } from './Transition';
/**
 * A state represents a condition in a state machine that is the result of the triggers processed.
 * @public
 */
export declare class State implements Vertex {
    readonly name: string;
    readonly parent: Region | undefined;
    /**
     * The fully qualified name of the vertex including its parent's qualified name.
     * @public
     */
    readonly qualifiedName: string;
    /**
     * The outgoing transitions available from this vertex.
     */
    outgoing: Array<Transition>;
    deferrableTrigger: Array<new (...args: any[]) => any>;
    /**
     * Creates a new instance of the State class.
     * @param name The name of the state.
     * @param parent The parent region of the state or a state whose default region will be used as the parent region.
     * If left undefined, this state is the root state in a state machine model.
     * @public
     */
    constructor(name: string, parent?: State | Region | undefined);
    /**
     * Returns the default state of the region; creates one if it does not already exist.
     * @returns Returns the default region.
     * @public
     */
    getDefaultRegion(): Region;
    /**
     * Tests the state to see if it is a simple state (having no child regions).
     * @returns True if the state has no child regions.
     * @public
     */
    isSimple(): boolean;
    /**
     * Tests the state to see if it is a composite state (having one or more child regions).
     * @returns True if the state has one or more child regions.
     * @public
     */
    isComposite(): boolean;
    /**
     * Tests the state to see if it is a composite state (having two or more child regions).
     * @returns True if the state has two or more child regions.
     * @public
     */
    isOrthogonal(): boolean;
    /**
     * Adds behaviour to the state to be called every time the state is entered.
     * @param action The behaviour to call on state entry.
     * @returns Returns the state.
     * @public
     */
    entry(action: (trigger: any) => void): this;
    /**
     * Adds behaviour to the state to be called every time the state is exited.
     * @param action The behaviour to call on state exit.
     * @returns Returns the state.
     * @public
     */
    exit(action: (trigger: any) => void): this;
    on<TTrigger>(type: new (...args: any[]) => TTrigger): Transition<TTrigger>;
    /**
     * Creates a new external transition.
     * @param TTrigger The type of the trigger event that may cause the transition to be traversed.
     * @param target The target vertex of the external transition.
     * @returns The external transition.
     * @public
     */
    external<TTrigger>(target: Vertex): Transition<TTrigger>;
    /**
     * Creates a new external transition.
     * @param TTrigger The type of the trigger event that may cause the transition to be traversed.
     * @param target The target vertex of the external transition.
     * @returns If target is specified, returns an external transition otherwide an internal transition.
     * @public
     */
    to<TTrigger>(target: Vertex | undefined): Transition<TTrigger>;
    /**
     * Creates a new internal transition.
     * @param TTrigger The type of the trigger event that may cause the transition to be traversed.
     * @returns Returns the internal transition.
     * @public
     */
    internal<TTrigger>(): Transition<TTrigger>;
    /**
     * Creates a new local transition.
     * @param TTrigger The type of the trigger event that may cause the transition to be traversed.
     * @param target The target vertex of the local transition.
     * @returns Returns the local transition.
     * @public
     */
    local<TTrigger>(target: Vertex): Transition<TTrigger>;
    defer<TTrigger>(trigger: new (...args: any[]) => TTrigger): State;
    /**
     * Returns the fully qualified name of the state.
     * @public
     */
    toString(): string;
}
