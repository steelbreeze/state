import { Vertex } from './Vertex';
import { State } from './State';
import { Region } from './Region';
/**
 * Interface for state machine instance classes to implement, allowing users of state to create their own to suit their persistance and transaction management needs.
 */
export interface IInstance {
    /**
     * The root element of a state machine model.
     */
    readonly root: State;
    /**
     * Passes an event trigger to a state machine instance for evaluation, which may result in state transitions occurring.
     * @param trigger The event to pass in as a trigger.
     * @returns Returns true if the trigger caused a state change.
     */
    evaluate(trigger: any): boolean;
    /**
     * Adds a trigger event to the event pool for later evaluation (once the state machine has changed state).
     * @param state The state at which the trigger event was deferred at.
     * @param trigger The trigger event to defer.
     */
    defer(state: State, trigger: any): void;
    /**
     * Updates the transactional state of a region with the last entered vertex.
     * @param vertex The vertex set as its parents last entered vertex.
     * @remarks This should only be called by the state machine runtime.
     */
    setVertex(vertex: Vertex): void;
    /**
     * Updates the transactional state of a region with the last entered state.
     * @param state The state set as its parents last entered state.
     * @remarks This should only be called by the state machine runtime, and implementors note, you also need to update the last entered vertex within this call.
     */
    setState(state: State): void;
    /**
     * Returns the last entered vertex to the state machine runtime.
     * @param region The region to get the last entered vertex of.
     * @returns Returns the last entered vertex for the given region.
     */
    getVertex(region: Region): Vertex;
    /**
     * Returns the last entered state to the state machine runtime.
     * @param region The region to get the last entered state of.
     * @returns Returns the last entered state for the given region.
     */
    getState(region: Region): State;
    /**
     * Get the last known clean state for a given region.
     * @param region The region to get the last known state of.
     * @returns Returns the last known state of the given region or undefined if the region has not yet been entered.
     * @remarks This is the safe method to use to query state machine instances.
     */
    getLastKnownState(region: Region): State | undefined;
}
