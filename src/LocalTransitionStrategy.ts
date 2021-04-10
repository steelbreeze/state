import { Vertex } from '.';
import { Transaction } from './Transaction';
import { TransitionStrategy } from './TransitionStrategy';

/**
 * Logic used to traverse local transitions.
 */
export class LocalTransitionStrategy implements TransitionStrategy {
	vertexToEnter: Vertex | undefined;

	constructor(private readonly target: Vertex) {
	}

	doExitSource(transaction: Transaction, history: boolean, trigger: any): void {
		this.vertexToEnter = toEnter(transaction, this.target);

		if (!this.vertexToEnter.isActive(transaction) && this.vertexToEnter.parent) {
			const vertex = transaction.getVertex(this.vertexToEnter.parent);

			if (vertex) {
				vertex.doExit(transaction, history, trigger);
			}
		}
	}

	doEnterTarget(transaction: Transaction, history: boolean, trigger: any): void {
		if (this.vertexToEnter && !this.vertexToEnter.isActive(transaction)) {
			this.vertexToEnter.doEnter(transaction, history, trigger);
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