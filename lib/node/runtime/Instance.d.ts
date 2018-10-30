import * as model from '../model';
import { IInstance } from '../runtime';
export declare class Instance implements IInstance {
    private readonly name;
    readonly root: model.State;
    private cleanState;
    private dirtyState;
    private dirtyVertex;
    constructor(name: string, root: model.State);
    beginTran(): void;
    commitTran(): void;
    setVertex(vertex: model.State | model.PseudoState): void;
    setState(state: model.State): void;
    /**
     * Returns the last known state of a given region. This is the call for the state machine runtime to use as it returns the dirty transactional state.
     * @param region The region to get the last known state of.
     * @returns Returns the last known region of the given state. If the state has not been entered this will return undefined.
     */
    getState(region: model.Region): model.State;
    getVertex(region: model.Region): model.State | model.PseudoState;
    /**
     * Returns the last known state of a given region. This is the call for application programmers to use as it returns the clean transactional state more efficently.
     * @param region The region to get the last known state of.
     * @returns Returns the last known region of the given state. If the state has not been entered this will return undefined.
     */
    getLastKnownState(region: model.Region): model.State | undefined;
    toString(): string;
}
