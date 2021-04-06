import { Vertex, Region, Visitor } from '.';
import { Transaction } from './Transaction';
import { types } from './types';
/**
 * A state is a situation in the lifecycle of the state machine that is stable between events.
 */
export declare class State extends Vertex {
    /** The parent region of the vertex. */
    readonly parent: Region | undefined;
    /**
     * The types of events that may be deferred while in this state.
     */
    private deferrableTriggers;
    /**
     * The default region for a composite state where regions are not explicitly defined.
     */
    private defaultRegion;
    /**
     * The user-defined actions that will be called upon state entry.
     */
    private entryActions;
    /**
     * The user-defined actions that will be called upon state exit.
     */
    private exitActions;
    /**
     * Creates a new instance of the state class.
     * @param name The name of the state.
     * @param parent The parent region of the state; note that another state can also be used, in which case the default region of the state will become this states parent. If parent is left undefined, then this state is the root of the state machine hierarchy.
     */
    constructor(name: string, parent?: State | Region | undefined);
    isActive(transaction: Transaction): boolean;
    /**
     * Adds a user-defined behaviour to call on state entry.
     * @param actions One or callbacks that will be passed the trigger event.
     * @return Returns the state thereby allowing a fluent style state construction.
     */
    entry(...actions: types.Behaviour<any>[]): this;
    /**
     * Adds a user-defined behaviour to call on state exit.
     * @param actions One or callbacks that will be passed the trigger event.
     * @return Returns the state thereby allowing a fluent style state construction.
     */
    exit(...actions: Array<types.Behaviour<any>>): this;
    /**
     * Adds the types of trigger event that can .
     * @param actions One or callbacks that will be passed the trigger event.
     * @return Returns the state thereby allowing a fluent style state construction.
     */
    defer(...type: types.Constructor<any>[]): this;
    /**
     * Tests a state to see if it is a simple state, one without and child regions.
     * @returns Returns true if the state is a simple state.
     */
    isSimple(): boolean;
    /**
     * Tests a state to see if it is a composite state, one with one or more child regions.
     * @returns Returns true if the state is a composite state.
     */
    isComposite(): boolean;
    /**
     * Tests a state to see if it is an orthogonal state, one with two or more child regions.
     * @returns Returns true if the state is an orthogonal state.
     */
    isOrthogonal(): boolean;
    /**
     * Tests a state to see if it is a final state, one without outgoing transitions.
     * @returns Returns true if the state is a final state.
     */
    isFinal(): boolean;
    /**
     * Accepts a visitor and calls visitor.visitStateHead method, cascades to child regions then calls the visitor.visitStateTail.
     * @param visitor The visitor to call back.
     */
    accept(visitor: Visitor): void;
}
