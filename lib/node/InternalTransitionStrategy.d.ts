import { Vertex, Instance } from '.';
import { TransitionStrategy } from './TransitionStrategy';
export declare class InternalTransitionStrategy implements TransitionStrategy {
    private readonly target;
    constructor(source: Vertex, target: Vertex);
    doEnterTarget(instance: Instance, history: boolean, trigger: any): void;
    doExitSource(instance: Instance, history: boolean, trigger: any): void;
}
