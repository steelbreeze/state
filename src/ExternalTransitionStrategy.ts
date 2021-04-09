import { Region, Vertex, PseudoState } from '.';
import { Transaction } from './Transaction';
import { TransitionStrategy } from './TransitionStrategy';

/**
 * Logic used to traverse external transitions.
 */
export class ExternalTransitionStrategy implements TransitionStrategy {
	private readonly toExit: Region | Vertex;
	private readonly toEnter: Array<Region | Vertex>;

	constructor(source: Vertex, target: Vertex) {
		// get the ancestry of the source and target vertices
		const sourceAncestors = ancestry(source);
		const targetAncestors = ancestry(target);

		// initialse iterators, both current ones and one before the pre
		let prevSource = sourceAncestors.next();
		let prevTarget = targetAncestors.next();
		let nextSource = sourceAncestors.next();
		let nextTarget = targetAncestors.next();

		// iterate past the common ancestors
		while (prevSource.value === prevTarget.value && !nextSource.done && !nextTarget.done) {
			prevSource = nextSource;
			prevTarget = nextTarget;

			nextSource = sourceAncestors.next();
			nextTarget = targetAncestors.next();
		}

		// the element to exit is the one past the last common ancestor on the source side
		this.toExit = prevSource.value;

		// all elements past the common ancestor on the target side must be entered
		this.toEnter = [prevTarget.value];

		while (!nextTarget.done) {
			this.toEnter.push(nextTarget.value);

			nextTarget = targetAncestors.next();
		}

		// if the target is a history pseudo state, remove it (as normal history behaviour its the parent region is required)
		if (target instanceof PseudoState && target.isHistory) {
			this.toEnter.pop();
		}
	}

	doExitSource(transaction: Transaction, history: boolean, trigger: any): void {
		this.toExit.doExit(transaction, history, trigger);
	}

	doEnterTarget(transaction: Transaction, history: boolean, trigger: any): void {
		// enter, but do not cascade entry all elements from below the common ancestor to the target
		this.toEnter.forEach((element, index) => element.doEnterHead(transaction, history, trigger, this.toEnter[index + 1]));

		// cascade entry from the target onwards
		this.toEnter[this.toEnter.length - 1].doEnterTail(transaction, history, trigger);
	}

	toString(): string {
		return "external";
	}
}

/**
 * Returns the ancestry of this element from the root element of the hierarchy to this element.
 * @returns Returns an iterable iterator used to process the ancestors.
 * @internal
 * @hidden
 */
function* ancestry(element: Region | Vertex): IterableIterator<Region | Vertex> {
	if (element.parent) {
		yield* ancestry(element.parent);
	}

	yield element;
}