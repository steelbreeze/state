import * as model from '../model';
import { IInstance } from '../runtime';
/**
 * Passes a trigger event into a state machine for evaluation.
 * @param instance The state machine instance to evaluate the trigger against.
 * @param trigger The trigger to evaluate.
 * @returns Returns true if the trigger caused a state transition.
 * @public
 */
/**
 * Passes a trigger event to a state for evaluation
 */
export declare function stateEvaluate(state: model.State, instance: IInstance, deepHistory: boolean, trigger: any): boolean;
/**
 * Runtime extension methods to the region class.
 */
declare module '../model/Region' {
    interface Region {
        enter(instance: IInstance, deepHistory: boolean, trigger: any): void;
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
        enter(instance: IInstance, deepHistory: boolean, trigger: any): void;
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
        getTransition(trigger: any): model.Transition | undefined;
        enter(instance: IInstance, deepHistory: boolean, trigger: any): void;
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
