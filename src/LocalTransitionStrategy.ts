import { Vertex, Transaction } from '.';
import { TransitionStrategy } from './TransitionStrategy';

/**
 * Logic used to traverse local transitions.
 */
export class LocalTransitionStrategy implements TransitionStrategy {
	vertexToEnter: Vertex | undefined;

	constructor(private readonly source: Vertex, private readonly target: Vertex) {
	}

	doExitSource(transaction: Transaction, history: boolean, trigger: any): void { 
		this.vertexToEnter = this.target;

		while (this.vertexToEnter.parent && this.vertexToEnter.parent.parent && !this.vertexToEnter.parent.parent.isActive(transaction)) {
			this.vertexToEnter = this.vertexToEnter.parent.parent;
		}

		if (!this.vertexToEnter.isActive(transaction) && this.vertexToEnter.parent) {
			transaction.getVertex(this.vertexToEnter.parent).doExit(transaction, history, trigger);
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
