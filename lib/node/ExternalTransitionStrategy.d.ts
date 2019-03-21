import { Vertex, Instance } from '.';
import { TransitionStrategy } from './TransitionStrategy';
export declare class ExternalTransitionStrategy implements TransitionStrategy {
    private readonly toExit;
    private readonly toEnter;
    constructor(source: Vertex, target: Vertex);
    doExitSource(instance: Instance, history: boolean, trigger: any): void;
    doEnterTarget(instance: Instance, history: boolean, trigger: any): void;
}
