import * as model from '../model';
import { IInstance } from '../runtime';
export declare function evaluate(state: model.State, instance: IInstance, deepHistory: boolean, trigger: any): boolean;
declare module '../model/Region' {
    interface Region {
        enter(instance: IInstance, deepHistory: boolean, trigger: any): void;
        enterHead(instance: IInstance, deepHistory: boolean, trigger: any): void;
        enterTail(instance: IInstance, deepHistory: boolean, trigger: any): void;
        leave(instance: IInstance, deepHistory: boolean, trigger: any): void;
    }
}
declare module '../model/PseudoState' {
    interface PseudoState {
        getTransition(trigger: any): model.Transition;
        enter(instance: IInstance, deepHistory: boolean, trigger: any): void;
        enterHead(instance: IInstance, deepHistory: boolean, trigger: any): void;
        enterTail(instance: IInstance, deepHistory: boolean, trigger: any): void;
        leave(instance: IInstance, deepHistory: boolean, trigger: any): void;
    }
}
declare module '../model/State' {
    interface State {
        getTransition(trigger: any): model.Transition | undefined;
        enter(instance: IInstance, deepHistory: boolean, trigger: any): void;
        enterHead(instance: IInstance, deepHistory: boolean, trigger: any): void;
        enterTail(instance: IInstance, deepHistory: boolean, trigger: any): void;
        leave(instance: IInstance, deepHistory: boolean, trigger: any): void;
    }
}
declare module '../model/Transition' {
    interface Transition<TTrigger> {
        execute(instance: IInstance, deepHistory: boolean, trigger: any): void;
    }
}
