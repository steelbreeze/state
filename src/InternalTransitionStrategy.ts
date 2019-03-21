import { Vertex, State, Instance } from '.';
import { TransitionStrategy } from './TransitionStrategy';

export class InternalTransitionStrategy implements TransitionStrategy {
	constructor(source: Vertex, private readonly target: Vertex) {
	}

	doEnterTarget(instance: Instance, history: boolean, trigger: any): void {
		if (this.target instanceof State) {
			this.target.completion(instance, history);
		}
	}

	doExitSource(instance: Instance, history: boolean, trigger: any): void {
	}
}
