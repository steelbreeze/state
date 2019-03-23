import { types, Vertex, Region, State } from '.';
export declare class Instance {
    readonly name: string;
    readonly root: State;
    private cleanState;
    private dirtyState;
    private dirtyVertex;
    private deferredEventPool;
    constructor(name: string, root: State);
    evaluate(trigger: any): boolean;
    transaction<TReturn>(operation: types.Producer<TReturn>): TReturn;
    defer(instance: Instance, trigger: any): void;
    evaluateDeferred(): void;
    setVertex(vertex: Vertex): void;
    getState(region: Region): State;
    getVertex(region: Region): Vertex;
    getLastKnownState(region: Region): State | undefined;
    toString(): string;
}
