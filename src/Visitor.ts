import { PseudoState, State, Region, Instance } from ".";

/**
 * Base for classes implementing the visitor pattern, used to walk a state machine model structure.
 */
export class Visitor {
	/**
	 * Called when the visitor starts to visit a state; before child regions are visited.
	 * @param state The state being visited.
	 */
	visitStateHead(state: State): any {		
	}

	/**
	 * Called when the visitor finishes visiting a state; after child regions are visited.
	 * @param state The state being visited.
	 */
	visitStateTail(state: State): any {		
	}

	/**
	 * Called when the visitor starts to visit a pseudo state.
	 * @param pseudoState The pseudo state being visited.
	 */
	visitPseudoStateHead(pseduoState: PseudoState): any {		
	}
	
	/**
	 * Called when the visitor finished visiting a pseudo state.
	 * @param pseudoState The pseudo state being visited.
	 */
	visitPseudoStateTail(pseduoState: PseudoState): any {		
	}
	
	/**
	 * Called when the visitor starts to visit a region; before child states are visited.
	 * @param state The state being visited.
	 */
	visitRegionHead(region: Region): any {
	}

	/**
	 * Called when the visitor finishes visiting a region; after child states are visited.
	 * @param state The state being visited.
	 */
	visitRegionTail(region: Region): any {
	}
}