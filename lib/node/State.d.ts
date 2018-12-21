import { func } from './util';
import { NamedElement } from './NamedElement';
import { Vertex } from './Vertex';
import { TransitionKind, Region, Transition, Instance } from './index';
/**
 * A state represents a condition in a state machine that is the result of the triggers processed.
 * @public
 */
export declare class State extends Vertex {
    readonly name: string;
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
     * Returns true if the state is a final state. A final state is one that has no outgoing transitions therefore no more state transitions can occur in it's parent region.
     */
    isFinal(): boolean;
    /**
     * Adds behaviour to the state to be called every time the state is entered.
     * @param action The behaviour to call on state entry.
     * @returns Returns the state.
     * @public
     */
    entry(action: func.Consumer<any>): this;
    /**
     * Adds behaviour to the state to be called every time the state is exited.
     * @param action The behaviour to call on state exit.
     * @returns Returns the state.
     * @public
     */
    exit(action: func.Consumer<any>): this;
    /**
     * Creates a new transition with a type test.
     * @remarks Once creates with the [[State.on]] method, the transition can be enhanced using the fluent API calls of [[Transition.if]], [[Transition.to]]/[[Transition.local]] and [[Transition.do]].
     * @param type The type of event that this transition will look for.
     * @returns Returns the newly created transition.
     * @public
     */
    on<TTrigger>(type: func.Constructor<TTrigger>): Transition<TTrigger>;
    when<TTrigger>(guard: func.Predicate<TTrigger>): Transition<TTrigger>;
    /**
     * Creates a new external transition.
     * @param TTrigger The type of the trigger event that may cause the transition to be traversed.
     * @param target The target vertex of the external transition.
     * @param kind The kind of transition, defaults to external, but can also be local.
     * @returns If target is specified, returns an external transition otherwide an internal transition.
     * @public
     */
    to<TTrigger>(target: Vertex, kind?: TransitionKind): Transition<TTrigger>;
    /**
     * Marks a particular type of event for deferral if it is not processed by the state. Deferred events are placed in the event pool for subsiquent evaluation.
     * @param type The type of event that this state will defer.
     * @returns Returns the state.
     * @public
     */
    defer<TTrigger>(type: func.Constructor<TTrigger>): State;
    /**
     * Passes a trigger event to a state machine instance for evaluation
     * @param state The state to evaluate the trigger event against.
     * @param instance The state machine instance to evaluate the trigger against.
     * @param deepHistory True if deep history semantics are invoked.
     * @param trigger The trigger event
     * @returns Returns true if the trigger was consumed by the state.
     * @hidden
     */
    evaluate(instance: Instance, deepHistory: boolean, trigger: any): boolean;
    /** Delegate a trigger to children for evaluation */
    private delegate;
    /** Evaluates the trigger event against the list of deferred transitions and defers into the event pool if necessary. */
    private deferTrigger;
    /** Initiate state entry */
    enterHead(instance: Instance, deepHistory: boolean, trigger: any, nextElement: NamedElement | undefined): void;
    /** Complete state entry */
    enterTail(instance: Instance, deepHistory: boolean, trigger: any): void;
    /** Leave a state */
    leave(instance: Instance, deepHistory: boolean, trigger: any): void;
    /** Checks for and executes completion transitions */
    completion(instance: Instance, deepHistory: boolean, trigger: any): void;
}
