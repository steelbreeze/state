import { Vertex } from './Vertex';
import { State } from './State';
import { IInstance } from './IInstance';
/**
 * Passes a trigger event to a state machine instance for evaluation
 * @param state The state to evaluate the trigger event against.
 * @param instance The state machine instance to evaluate the trigger against.
 * @param deepHistory True if deep history semantics are invoked.
 * @param trigger The trigger event
 * @returns Returns true if the trigger was consumed by the state.
 * @hidden
 */
export declare function evaluate(state: State, instance: IInstance, deepHistory: boolean, trigger: any): boolean;
/** Delegate a trigger to children for evaluation */
export declare function delegate(state: State, instance: IInstance, deepHistory: boolean, trigger: any): boolean;
/** Accept a trigger and vertex: evaluate the guard conditions of the transitions and traverse if one evaluates true. */
export declare function accept(vertex: Vertex, instance: IInstance, deepHistory: boolean, trigger: any): boolean;
/** Evaluates the trigger event against the list of deferred transitions and defers into the event pool if necessary. */
export declare function doDefer(state: State, instance: IInstance, trigger: any): boolean;
/** Checks for and executes completion transitions */
export declare function completion(state: State, instance: IInstance, deepHistory: boolean, trigger: any): void;
