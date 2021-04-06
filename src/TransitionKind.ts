/**
 * Specifies the behaviour of transitions.
 * @remarks As newly created Transitions are Local Transitions, there is no need to specify this within the TransitionKind enumeration.
 */
export enum TransitionKind {
	/** External transitions are the default transition type; the source vertex is exited, transition behaviour performed and the target entered. */
	External,
	
	/** A Local transition is one where the target vertex is in the child structure of the source; the source state is not exited. */
	Local
}
