import * as model from '../model';
export interface IInstance {
    readonly root: model.State;
    /**
     * Creates a transaction, performs an operation within a transactional context and commits the transaction post-operation.
     * @param operation The operation to perform within a transaction
     * @returns Returns the the return value of the operation
     */
    transaction<TReturn>(operation: () => TReturn): TReturn;
    /**
     * Updates the transactional state of a region with the last entered vertex.
     * @param vertex The vertex to
     */
    setVertex(vertex: model.State | model.PseudoState): void;
    setState(state: model.State): void;
    getVertex(region: model.Region): model.State | model.PseudoState;
    getState(region: model.Region): model.State;
    getLastKnownState(region: model.Region): model.State | undefined;
}
