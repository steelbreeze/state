import { Vertex, Instance } from '.';
import { TransitionStrategy } from './TransitionStrategy';
/**
 * Logic used to traverse internal transitions.
 */
export declare class InternalTransitionStrategy implements TransitionStrategy {
    private readonly target;
    constructor(source: Vertex, target: Vertex);
    doEnterTarget(instance: Instance, history: boolean, trigger: any): void;
    doExitSource(instance: Instance, history: boolean, trigger: any): void;
}
