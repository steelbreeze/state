import { Vertex, State, Region, Instance } from './';

/**
 * Represents a transaction within the execution of a state machine.
 * @hidden
 * @internal
 */
export class Transaction {
	/**
	 * The transactional active state configuration of the state machine.
	 * @hidden
	 * @internal
	 */
	readonly activeStateConfiguration: Record<string, State> = {};

	/** The last known vertex within a given region. */
	private readonly lastKnownVertex: Record<string, Vertex> = {};

	/**
	 * Creates a new instance of the Transaction class.
	 * @hidden
	 * @internal
	 */
	constructor(public instance: Instance) {
	}

	/** 
	 * Updates the last known state of the transaction.
	 * @param state The state to set as the last known state of its parent region.
	 * @hidden
	 * @internal
	 */
	setState(state: State) {
		if(state.parent) {
			this.activeStateConfiguration[state.parent.qualifiedName] = state;
		}
	}

	/** 
	 * Returns the last known state of a given region within the transaction.
	 * @param region The region to return the last known state of.
	 * @returns Returns the last know state from the transaction cache; if not found, it defers to the state machine instance active state configuration.
	 * @hidden
	 * @internal
	 */
	getState(region: Region): State {
		return this.activeStateConfiguration[region.qualifiedName] || this.instance.getState(region);
	}

	/** 
	 * Updates the last known vertex of the transaction.
	 * @param vertex The vertex to set as the last known state of its parent region.
	 * @hidden
	 * @internal
	 */
	setVertex(vertex: Vertex) {
		if(vertex.parent) {
			this.lastKnownVertex[vertex.parent.qualifiedName] = vertex;
		}
	}

	/** 
	 * Returns the last known vertex of a given region within the transaction.
	 * @param region The region to return the last known vertex of.
	 * @returns Returns the last know vertex from the transaction cache; if not found, it defers to the state machine instance active state configuration.
	 * @hidden
	 * @internal
	 */
	getVertex(region: Region): Vertex {
		return this.lastKnownVertex[region.qualifiedName] || this.instance.getState(region);
	}
}
