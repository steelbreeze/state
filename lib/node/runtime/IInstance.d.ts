import * as model from '../model';
export interface IInstance {
    readonly root: model.State;
    beginTran(): void;
    setVertex(vertex: model.State | model.PseudoState): void;
    setState(state: model.State): void;
    getVertex(region: model.Region): model.State | model.PseudoState;
    getState(region: model.Region): model.State;
    commitTran(): void;
    getLastKnownState(region: model.Region): model.State | undefined;
}
