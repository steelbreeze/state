import { Vertex, State, Region, Instance } from './';
export declare class Transaction {
    instance: Instance;
    readonly dirtyState: Record<string, State>;
    private readonly dirtyVertex;
    constructor(instance: Instance);
    setState(state: State): void;
    getState(region: Region): State;
    setVertex(vertex: Vertex): void;
    getVertex(region: Region): Vertex;
}
