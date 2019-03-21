import { Vertex, Instance } from '.';
import { TransitionStrategy } from './TransitionStrategy';

export class LocalTransitionStrategy implements TransitionStrategy {
	vertexToEnter: Vertex | undefined;

	constructor(private readonly source: Vertex, private readonly target: Vertex) {
	}

	doExitSource(instance: Instance, history: boolean, trigger: any): void { // TODO: review logic 
		this.vertexToEnter = this.target;

		while (this.vertexToEnter.parent && this.vertexToEnter.parent.parent && !this.vertexToEnter.parent.parent.isActive(instance)) {
			this.vertexToEnter = this.vertexToEnter.parent.parent;
		}

		if (!this.vertexToEnter.isActive(instance) && this.vertexToEnter.parent) {
			instance.getVertex(this.vertexToEnter.parent).doExit(instance, history, trigger);
		}
	}

	doEnterTarget(instance: Instance, history: boolean, trigger: any): void {
		if (this.vertexToEnter && !this.vertexToEnter.isActive(instance)) {
			this.vertexToEnter.doEnter(instance, history, trigger);
		}
	}
}
