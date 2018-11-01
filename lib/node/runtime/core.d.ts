import * as model from '../model';
import { IInstance } from '../runtime';
/**
 * Initialises a state machine instance to its starting state.
 * @param instance The state machine instance.
 * @public
 */
export declare function initialise(instance: IInstance): void;
/**
 * Passes a trigger event into a state machine for evaluation.
 * @param instance The state machine instance to evaluate the trigger against.
 * @param trigger The trigger to evaluate.
 * @returns Returns true if the trigger caused a state transition.
 * @public
 */
export declare function evaluate(instance: IInstance, trigger: any): boolean;
/**
 * Runtime extension methods to the region class.
 */
declare module '../model/Region' {
    interface Region {
        enterHead(instance: IInstance, deepHistory: boolean, trigger: any): void;
        enterTail(instance: IInstance, deepHistory: boolean, trigger: any): void;
        leave(instance: IInstance, deepHistory: boolean, trigger: any): void;
    }
}
/**
 * Runtime extensions to the pseudo state class
 */
declare module '../model/PseudoState' {
    interface PseudoState {
        getTransition(trigger: any): model.Transition;
        enterHead(instance: IInstance, deepHistory: boolean, trigger: any): void;
        enterTail(instance: IInstance, deepHistory: boolean, trigger: any): void;
        leave(instance: IInstance, deepHistory: boolean, trigger: any): void;
    }
}
/**
 * Runtime extension methods to the state class.
 */
declare module '../model/State' {
    interface State {
        evaluate(instance: IInstance, deepHistory: boolean, trigger: any): boolean;
        delegate(instance: IInstance, deepHistory: boolean, trigger: any): boolean;
        getTransition(trigger: any): model.Transition | undefined;
        completion(instance: IInstance, deepHistory: boolean, trigger: any): void;
        enterHead(instance: IInstance, deepHistory: boolean, trigger: any): void;
        enterTail(instance: IInstance, deepHistory: boolean, trigger: any): void;
        leave(instance: IInstance, deepHistory: boolean, trigger: any): void;
    }
}
/**
 * Runtime extension methods to the transition base class.
 */
declare module '../model/Transition' {
    interface Transition<TTrigger> {
        execute(instance: IInstance, deepHistory: boolean, trigger: any): void;
    }
}
