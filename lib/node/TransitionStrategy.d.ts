import { Instance } from '.';
export interface TransitionStrategy {
    doExitSource(instance: Instance, history: boolean, trigger: any): void;
    doEnterTarget(instance: Instance, history: boolean, trigger: any): void;
}
