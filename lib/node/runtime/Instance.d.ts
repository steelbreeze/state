import * as model from '../model';
import { IInstance } from '../runtime';
/**
 * Represents the active state configuration of a state machine instance.
 * @remarks This is the default implementation of the IInstance class and reads/writes to the active state configuration in a transactional manner at both initilisation and each call to evaluate.
 */
export declare class Instance implements IInstance {
    private readonly name;
    readonly root: model.State;
    private cleanState;
    private dirtyState;
    private dirtyVertex;
    /**
     * Creates an instance of the Instance class.
     * @param name The name of the state machine instance.
     * @param root The root element of the state machine model that this an instance of.
     */
    constructor(name: string, root: model.State);
    /**
     * Passes a trigger event to the state machine instance for evaluation.
     * @param trigger The trigger event to evaluate.
     * @returns Returns true if the trigger event caused a state transition.
     */
    evaluate(trigger: any): boolean;
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
    setVertex(vertex: model.State | model.PseudoState): void;
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
    getVertex(region: model.Region): model.State | model.PseudoState;
    /**
     * Returns the last known state of a given region. This is the call for application programmers to use as it returns the clean transactional state more efficently.
     * @param region The region to get the last known state of.
     * @returns Returns the last known region of the given state. If the state has not been entered this will return undefined.
     */
    getLastKnownState(region: model.Region): model.State | undefined;
    /**
     * Returns the name of the state machine instance.
     * @returns The name of the state machine instance.
     */
    toString(): string;
}
