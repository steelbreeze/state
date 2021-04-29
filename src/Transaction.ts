import { Region, State, Instance } from './';
import { Vertex } from './Vertex';

/**
 * Represents a transaction within the execution of a state machine.
 * @hidden
 * @internal
 */
export class Transaction extends Map<Region,State> {
	/** The last known vertex within a given region. */
	private readonly lastKnownVertex = new Map<Region, Vertex>();

	/**
	 * Creates a new instance of the Transaction class.
	 * @hidden
	 * @internal
	 */
	constructor(public readonly instance: Instance) {
		super();
	}

	/** 
	 * Returns the last known state of a given region within the transaction.
	 * @param region The region to return the last known state of.
	 * @returns Returns the last know state from the transaction cache; if not found, it defers to the state machine instance active state configuration.
	 * @hidden
	 * @internal
	 */
	get(region: Region): State | undefined {
		return super.get(region) || this.instance.get(region);
	}

	/** 
	 * Updates the last known vertex of the transaction.
	 * @param vertex The vertex to set as the last known state of its parent region.
	 * @hidden
	 * @internal
	 */
	setVertex(vertex: Vertex) { // TODO: refactor set and setVertex
		if(vertex.parent) {
			this.lastKnownVertex.set(vertex.parent, vertex);

			if(vertex instanceof State) {
				this.set(vertex.parent, vertex);
			}
		}
	}

	/** 
	 * Returns the last known vertex of a given region within the transaction.
	 * @param region The region to return the last known vertex of.
	 * @returns Returns the last know vertex from the transaction cache; if not found, it defers to the state machine instance active state configuration.
	 * @hidden
	 * @internal
	 */
	getVertex(region: Region): Vertex | undefined {
		return this.lastKnownVertex.get(region) || this.instance.get(region);
	}
}
