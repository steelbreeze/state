import { PseudoState, State, Region, Instance } from ".";

/**
 * Interface required of classes implementing the visitor pattern, used to walk a state machine model structure.
 */
export interface Visitor {
	/**
	 * Called when the visitor visits a state.
	 * @param state The state being visited.
	 * @param instance The optional state machine instance.
	 */
	visitState(state: State, instance: Instance | undefined): any;

	/**
	 * Called when the visitor visits a pseudo state.
	 * @param pseudoState The pseudo state being visited.
	 * @param instance The optional state machine instance.
	 */
	visitPseudoState(pseduoState: PseudoState, instance: Instance | undefined): any;
	
	/**
	 * Called when the visitor visits a region.
	 * @param state The state being visited.
	 * @param instance The optional state machine instance.
	 */
	visitRegion(region: Region, instance: Instance | undefined): any;
}