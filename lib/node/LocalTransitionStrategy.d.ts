import { Vertex, Instance } from '.';
import { TransitionStrategy } from './TransitionStrategy';
export declare class LocalTransitionStrategy implements TransitionStrategy {
    private readonly source;
    private readonly target;
    vertexToEnter: Vertex | undefined;
    constructor(source: Vertex, target: Vertex);
    doExitSource(instance: Instance, history: boolean, trigger: any): void;
    doEnterTarget(instance: Instance, history: boolean, trigger: any): void;
}
