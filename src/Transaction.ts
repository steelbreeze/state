import { Vertex, State, Region, Instance } from './';

export class Transaction {
	readonly dirtyState: Record<string, State> = {};
	private readonly dirtyVertex: Record<string, Vertex> = {};

	constructor(public instance: Instance) {
	}

	setState(state: State) {
		if(state.parent) {
			this.dirtyState[state.parent.qualifiedName] = state;
		}
	}

	getState(region: Region): State {
		return this.dirtyState[region.qualifiedName] || this.instance.getState(region);
	}

	setVertex(vertex: Vertex) {
		if(vertex.parent) {
			this.dirtyVertex[vertex.parent.qualifiedName] = vertex;
		}
	}

	getVertex(region: Region): Vertex {
		return this.dirtyVertex[region.qualifiedName] || this.instance.getState(region);
	}
}