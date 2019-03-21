import { NamedElement, Vertex, PseudoState, Instance } from '.';
import { TransitionStrategy } from './TransitionStrategy';

export class ExternalTransitionStrategy implements TransitionStrategy {
	private readonly toExit: NamedElement;
	private readonly toEnter: Array<NamedElement>;

	constructor(source: Vertex, target: Vertex) {
		const sourceAncestors = source.getAncestors();
		const targetAncestors = target.getAncestors();
		let prevSource = sourceAncestors.next();
		let prevTarget = targetAncestors.next();
		let nextSource = sourceAncestors.next();
		let nextTarget = targetAncestors.next();

		while (prevSource.value === prevTarget.value && !nextSource.done && !nextTarget.done) {
			prevSource = nextSource;
			prevTarget = nextTarget;

			nextSource = sourceAncestors.next();
			nextTarget = targetAncestors.next();
		}

		this.toExit = prevSource.value;
		this.toEnter = [prevTarget.value];

		while (!nextTarget.done) {
			this.toEnter.push(nextTarget.value);

			nextTarget = targetAncestors.next();
		}

		if (target instanceof PseudoState && target.isHistory()) {
			this.toEnter.pop();
		}
	}

	doExitSource(instance: Instance, history: boolean, trigger: any): void {
		this.toExit.doExit(instance, history, trigger);
	}

	doEnterTarget(instance: Instance, history: boolean, trigger: any): void {
		this.toEnter.forEach((element, index) => element.doEnterHead(instance, history, trigger, this.toEnter[index + 1]));
		this.toEnter[this.toEnter.length - 1].doEnterTail(instance, history, trigger);
	}
}
