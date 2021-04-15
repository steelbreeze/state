import { Vertex } from '.';
import { Transaction } from './Transaction';
import { TransitionStrategy } from './TransitionStrategy';

/**
 * Logic used to traverse local transitions.
 * @hidden
 */
export class LocalTransitionStrategy implements TransitionStrategy {
	vertexToEnter: Vertex | undefined;

	constructor(private readonly target: Vertex) {
		// NOTE: local transition behaviour is dependant on the active state configuration at the time of execution, hence logic is in doExitSource
	}

	/**
	 * Leave the source of the transition as needed
	 */
	doExit(transaction: Transaction, deepHistory: boolean, trigger: any): void {
		// Find the first inactive vertex abode the target
		this.vertexToEnter = toEnter(transaction, this.target);

		// exit the active sibling of the vertex to enter
		if (!this.vertexToEnter.isActive(transaction) && this.vertexToEnter.parent) {
			const vertex = transaction.getVertex(this.vertexToEnter.parent);

			if (vertex) {
				vertex.doExit(transaction, deepHistory, trigger);
			}
		}
	}

	doEnter(transaction: Transaction, deepHistory: boolean, trigger: any): void {
		if (this.vertexToEnter && !this.vertexToEnter.isActive(transaction)) {
			this.vertexToEnter.doEnter(transaction, deepHistory, trigger);
		}
	}

	toString(): string {
		return "local";
	}
}

/**
 * Determines the vertex that will need to be entered; the first non-active vertex in the ancestry above the target vertex.
 * @param transaction 
 * @param vertex 
 * @returns 
 * @hidden
 */
function toEnter(transaction: Transaction, vertex: Vertex): Vertex {
	while (vertex.parent && vertex.parent.parent && !vertex.parent.parent.isActive(transaction)) {
		vertex = vertex.parent.parent;
	}

	return vertex;
}