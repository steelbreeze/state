import * as model from '../model';
import { IInstance } from '../runtime';
/**
 * Passes a trigger event to a state machine instance for evaluation
 * @param state The state to evaluate the trigger event against.
 * @param instance The state machine instance to evaluate the trigger against.
 * @param deepHistory True if deep history semantics are invoked.
 * @param trigger The trigger event
 * @returns Returns true if the trigger was consumed by the state.
 * @hidden
 */
export declare function evaluate(state: model.State, instance: IInstance, deepHistory: boolean, trigger: any): boolean;
