import { Vertex, Instance } from '.';
import { TransitionStrategy } from './TransitionStrategy';
/**
 * Logic used to traverse local transitions.
 */
export declare class LocalTransitionStrategy implements TransitionStrategy {
    private readonly source;
    private readonly target;
    vertexToEnter: Vertex | undefined;
    constructor(source: Vertex, target: Vertex);
    doExitSource(instance: Instance, history: boolean, trigger: any): void;
    doEnterTarget(instance: Instance, history: boolean, trigger: any): void;
    toString(): string;
}
