/** Common properties of all elements that make up a [state machine model]{@link StateMachine}. */
export interface IElement {
	/** Invalidates a [state machine model]{@link StateMachine} causing it to require recompilation. */
	invalidate(): void;
}