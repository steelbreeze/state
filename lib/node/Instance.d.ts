import { Region, State } from '.';
/**
 * Represents an instance of a state machine model at runtime; there can be many seperate state machine instances using a common model.
 */
export declare class Instance {
    readonly name: string;
    readonly root: State;
    /** The stable active state configuration of the state machine. */
    private cleanState;
    /** The changes made to the active state configuration during transaction execution. */
    private dirtyState;
    /** The the last known active vertex during transaction execution. */
    private dirtyVertex;
    /** The deferred triggers awaiting evaluation once the current active state configuration changes. */
    private deferredEventPool;
    /**
     * Creates a new state machine instance conforming to a particular state machine model.
     * @param name The name of the state machine instance.
     * @param root The root state of the state machine instance.
     */
    constructor(name: string, root: State);
    /**
     * Evaluates a trigger event to see if it causes a state transition.
     * @param trigger The trigger event to evaluate.
     * @returns Returns true if the trigger event caused a change in the active state configuration or was deferred.
     */
    evaluate(trigger: any): boolean;
    /**
     * Performs an operation that may alter the active state configuration with a transaction.
     * @param operation The operation to perform within a transaction.
     */
    private transaction;
    /**
     * Evaluates trigger events in the deferred event pool.
     */
    private evaluateDeferred;
    /**
     * Returns the last known state of a region from the stable active state configuration.
     * @param region The region to find the last know state of.
     * @returns Returns the last known state of the region or undefined if the region has not been entered.
     */
    getLastKnownState(region: Region): State | undefined;
    /**
     * Returns the name of the state machine instance.
     * @returns Returns the name of the state machine instance.
     */
    toString(): string;
}
