import * as model from '../model';
import { IInstance, initialise } from '../runtime';

export class Instance implements IInstance {
	private cleanState: Record<string, model.State> = {};                      // NOTE: this is the persistent representation of state machine state
	private dirtyState: Record<string, model.State> = {};                      //       this is the state machine state with the transaction context and will update lastKnownState on commit
	private dirtyVertex: Record<string, model.State | model.PseudoState> = {}; //       this is transient within the transaction context and is discarded

	public constructor(private readonly name: string, public readonly root: model.State) {
		initialise(this);
	}

	public beginTran(): void {
		this.dirtyState = {};
		this.dirtyVertex = {};
	}

	public commitTran(): void {
		for (let k = Object.keys(this.dirtyState), i = k.length; i--;) {
			this.cleanState[k[i]] = this.dirtyState[k[i]];
		}
	}

	public setVertex(vertex: model.State | model.PseudoState): void {
		if (vertex.parent) {
			this.dirtyVertex[vertex.parent.qualifiedName] = vertex;
		}
	}

	public setState(state: model.State): void {
		if (state.parent) {
			this.dirtyVertex[state.parent.qualifiedName] = state;
			this.dirtyState[state.parent.qualifiedName] = state;
		}
	}

	/**
	 * Returns the last known state of a given region. This is the call for the state machine runtime to use as it returns the dirty transactional state.
	 * @param region The region to get the last known state of.
	 * @returns Returns the last known region of the given state. If the state has not been entered this will return undefined.
	 */
	public getState(region: model.Region): model.State {
		return this.dirtyState[region.qualifiedName] || this.cleanState[region.qualifiedName];
	}

	public getVertex(region: model.Region): model.State | model.PseudoState {
		return this.dirtyVertex[region.qualifiedName] || this.cleanState[region.qualifiedName];
	}

	/**
	 * Returns the last known state of a given region. This is the call for application programmers to use as it returns the clean transactional state more efficently.
	 * @param region The region to get the last known state of.
	 * @returns Returns the last known region of the given state. If the state has not been entered this will return undefined.
	 */
	public getLastKnownState(region: model.Region): model.State | undefined {
		return this.cleanState[region.qualifiedName];
	}

	public toString(): string {
		return this.name;
	}
}