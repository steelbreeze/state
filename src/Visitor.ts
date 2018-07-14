import { IElement } from './IElement';
import { Region } from './Region';
import { Vertex } from './Vertex';

import { PseudoState, State, StateMachine, Transition } from './state';

/** Base class for vistors that will walk the [state machine model]{@link StateMachine}; used in conjunction with the [accept]{@linkcode StateMachine.accept} methods on all [elements]{@link IElement}. Visitor is an mplementation of the [visitor pattern]{@link https://en.wikipedia.org/wiki/Visitor_pattern}. */
export abstract class Visitor {
	/** Visits an [element]{@link IElement} within a [state machine model]{@link StateMachine}; use this for logic applicable to all [elements]{@link IElement}.
	 * @param element The [element]{@link IElement} being visited.
	 * @param args The arguments passed to the initial accept call.
	 */
	visitElement<TElement extends IElement>(element: TElement, ...args: any[]): any {
	}

	/** Visits a [region]{@link Region} within a [state machine model]{@link StateMachine}.
	 * @param element The [reigon]{@link Region} being visited.
	 * @param args The arguments passed to the initial accept call.
	 */
	visitRegion(region: Region, ...args: any[]): any {
		for (const vertex of region.children) {
			vertex.accept(this, ...args);
		}

		return this.visitElement(region, ...args);
	}

	/** Visits a [vertex]{@link Vertex} within a [state machine model]{@link StateMachine}; use this for logic applicable to all [vertices]{@link Vertex}.
	 * @param vertex The [vertex]{@link Vertex} being visited.
	 * @param args The arguments passed to the initial accept call.
	 */
	visitVertex(vertex: Vertex, ...args: any[]): any {
		for (const transition of vertex.outgoing) {
			transition.accept(this, ...args);
		}

		return this.visitElement(vertex, ...args);
	}

	/** Visits a [pseudo state]{@link PseudoState} within a [state machine model]{@link StateMachine}.
	 * @param element The [pseudo state]{@link PseudoState} being visited.
	 * @param args The arguments passed to the initial accept call.
	 */
	visitPseudoState(pseudoState: PseudoState, ...args: any[]): any {
		return this.visitVertex(pseudoState, ...args);
	}

	/** Visits a [state]{@link State} within a [state machine model]{@link StateMachine}.
	 * @param element The [state]{@link State} being visited.
	 * @param args The arguments passed to the initial accept call.
	 */
	visitState(state: State, ...args: any[]): any {
		for (const region of state.children) {
			region.accept(this, ...args);
		}

		return this.visitVertex(state, ...args);
	}

	/** Visits a [state machine]{@link StateMachine} within a [state machine model]{@link StateMachine}.
	 * @param element The [state machine]{@link StateMachine} being visited.
	 * @param args The arguments passed to the initial accept call.
	 */
	visitStateMachine(stateMachine: StateMachine, ...args: any[]): any {
		for (const region of stateMachine.children) {
			region.accept(this, ...args);
		}

		return this.visitElement(stateMachine, ...args);
	}

	/** Visits a [transition]{@link Transition} within a [state machine model]{@link StateMachine}.
	 * @param element The [transition]{@link Transition} being visited.
	 * @param args The arguments passed to the initial accept call.
	 */
	visitTransition(transition: Transition, ...args: any[]): any {
	}
}
