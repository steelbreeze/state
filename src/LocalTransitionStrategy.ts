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
		this.vertexToEnter = this.target;
		const parent = this.vertexToEnter.parent;

		while (parent && parent.parent && !parent.parent.isActive(transaction)) {
			this.vertexToEnter = parent.parent;
		}

		if (!this.vertexToEnter.isActive(transaction) && parent) {
			const vertex = transaction.getVertex(parent);
			
			if(vertex) {
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
