import * as model from '../model';
import { IInstance, IState } from '../runtime';
/**
 * Represents the active state configuration of a state machine instance.
 * @remarks This is the default implementation of the IInstance class and reads/writes to the active state configuration in a transactional manner at both initilisation and each call to evaluate.
 */
export declare class Instance implements IInstance {
    readonly name: string;
    readonly root: model.State;
    /**
     * Outstanding events marked for deferral.
     */
    private deferredEventPool;
    /**
     * Creates an instance of the Instance class.
     * @param name The name of the state machine instance.
     * @param root The root element of the state machine model that this an instance of.
     * @param activeStateConfiguration Optional JSON object used to initialise the active state configuration. The json object must have been produced by a prior call to Instance.toJSON from an instance using the same model.
     */
    constructor(name: string, root: model.State, activeStateConfiguration?: IState | undefined);
    /**
     * Passes a trigger event to the state machine instance for evaluation.
     * @param trigger The trigger event to evaluate.
     * @returns Returns true if the trigger event was consumed by the state machine (caused a transition or was deferred).
     */
    evaluate(trigger: any): boolean;
    /**
     * Adds a trigger event to the event pool for later evaluation (once the state machine has changed state).
     * @param trigger The trigger event to defer.
     */
    defer(state: model.State, trigger: any): void;
    /** Check for and send deferred events for evaluation */
    processDeferredEvents(): void;
    /** Build a list of all the deferrable events at a particular state (including its children) */
    activeStateConfigurationDeferrableTriggers(state: model.State): Array<new (...args: any[]) => any>;
    /**
     * Performs an operation within a transactional context.
     * @param TReturn The type of the return parameter of the transactional operation.
     * @param operation The operation to perform within the transactional context.
     * @returns Returns the return value from the transactional context.
     */
    transaction<TReturn>(operation: () => TReturn): TReturn;
    /**
     * Updates the transactional state of a region with the last entered vertex.
     * @param vertex The vertex set as its parents last entered vertex.
     * @remarks This should only be called by the state machine runtime.
     */
    setVertex(vertex: model.Vertex): void;
    /**
     * Updates the transactional state of a region with the last entered state.
     * @param state The state set as its parents last entered state.
     * @remarks This should only be called by the state machine runtime, and implementors note, you also need to update the last entered vertex within this call.
     */
    setState(state: model.State): void;
    /**
     * Returns the last known state of a given region. This is the call for the state machine runtime to use as it returns the dirty transactional state.
     * @param region The region to get the last known state of.
     * @returns Returns the last known region of the given state. If the state has not been entered this will return undefined.
     */
    getState(region: model.Region): model.State;
    /**
     * Returns the last entered vertex to the state machine runtime.
     * @param region The region to get the last entered vertex of.
     * @returns Returns the last entered vertex for the given region.
     */
    getVertex(region: model.Region): model.Vertex;
    /**
     * Returns the last known state of a given region. This is the call for application programmers to use as it returns the clean transactional state more efficently.
     * @param region The region to get the last known state of.
     * @returns Returns the last known region of the given state. If the state has not been entered this will return undefined.
     */
    getLastKnownState(region: model.Region): model.State | undefined;
    /**
     * Serialize the active state configuration of the state machine instance to JSON.
     * @param Optional starting state; defaults to the root element within the state machine model.
     * @returns Returns the JSON representation of the active state configuration. This contains just the hierarchy of states and regions with the last known state of each region.
     */
    toJSON(state?: model.State): IState;
    /**
     * Returns the name of the state machine instance.
     * @returns The name of the state machine instance.
     */
    toString(): string;
}
