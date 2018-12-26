import { State, Region } from './index';
/**
 * Represents the active state configuration of a state machine instance.
 * @remarks This is the default implementation of the IInstance class and reads/writes to the active state configuration in a transactional manner at both initilisation and each call to evaluate.
 */
export declare class Instance {
    readonly name: string;
    readonly root: State;
    /**
     * Creates a new instance of the Instance class.
     * @param name The name of the state machine instance.
     * @param root The root element of the state machine model that this an instance of.
     * @param activeStateConfiguration Optional JSON object used to initialise the active state configuration. The json object must have been produced by a prior call to Instance.toJSON from an instance using the same model.
     */
    constructor(name: string, root: State);
    /**
     * Passes a trigger event to the state machine instance for evaluation.
     * @param trigger The trigger event to evaluate.
     * @returns Returns true if the trigger event was consumed by the state machine (caused a transition or was deferred).
     */
    evaluate(trigger: any): boolean;
    /**
     * Returns the last known state of a given region. This is the call for application programmers to use as it returns the clean transactional state more efficently.
     * @param region The region to get the last known state of.
     * @returns Returns the last known region of the given state. If the state has not been entered this will return undefined.
     */
    getLastKnownState(region: Region): State | undefined;
    /**
     * Returns the name of the state machine instance.
     * @returns The name of the state machine instance.
     */
    toString(): string;
}
