import { Region, Vertex, PseudoState } from '.';
import { PseudoStateKind } from './PseudoStateKind';
import { Transaction } from './Transaction';
import { TransitionStrategy } from './TransitionStrategy';

/**
 * Logic used to traverse external transitions.
 */
export class ExternalTransitionStrategy implements TransitionStrategy {
	/** The element that will need to be exited when the transition is traversed. This is not necessarily the source of the transition, but the element beneath the least common ancestor of the source and target on the source side. */
	private readonly toExit: Region | Vertex;

	/** The elements that will need to be entered when the transition is traversed. */
	private readonly toEnter: Array<Region | Vertex>;

	/**
	 * Creates a new instance of an external transition strategy; this determines the entry and exit actions that will be called when the transition is traversed.
	 * @param source The source vertex of the transition.
	 * @param target The target vertex of the transition.
	 */
	constructor(source: Vertex, target: Vertex) {
		// create iterators over the source and target vertex ancestry
		const sourceIterator = ancestry(source);
		const targetIterator = ancestry(target);

		// get the first result from each iterator (this will always be the state machine root element)
		let sourceResult = sourceIterator.next();
		let targetResult = targetIterator.next();

		// iterate through all the common ancestors
		do {
			this.toExit = sourceResult.value;
			this.toEnter = [targetResult.value];

			sourceResult = sourceIterator.next();
			targetResult = targetIterator.next();

		} while (this.toExit === this.toEnter[0] && !sourceResult.done && !targetResult.done);

		// all elements past the common ancestor on the target side must be entered
		while (!targetResult.done) {
			this.toEnter.push(targetResult.value);

			targetResult = targetIterator.next();
		}

		// if the target is a history pseudo state, remove it (as normal history behaviour its the parent region is required)
		if (target instanceof PseudoState && target.is(PseudoStateKind.History)) {
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
