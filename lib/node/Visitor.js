"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Visitor = void 0;
/**
 * Base for classes implementing the visitor pattern, used to walk a state machine model structure.
 */
class Visitor {
    /**
     * Called when the visitor starts to visit a state; before child regions are visited.
     * @param state The state being visited.
     */
    visitState(state) {
    }
    /**
     * Called when the visitor finishes visiting a state; after child regions are visited.
     * @param state The state being visited.
     */
    visitStateTail(state) {
    }
    /**
     * Called when the visitor starts to visit a pseudo state.
     * @param pseudoState The pseudo state being visited.
     */
    visitPseudoState(pseduoState) {
    }
    /**
     * Called when the visitor finished visiting a pseudo state.
     * @param pseudoState The pseudo state being visited.
     */
    visitPseudoStateTail(pseduoState) {
    }
    /**
     * Called when the visitor starts to visit a region; before child states are visited.
     * @param state The state being visited.
     */
    visitRegion(region) {
    }
    /**
     * Called when the visitor finishes visiting a region; after child states are visited.
     * @param state The state being visited.
     */
    visitRegionTail(region) {
    }
}
exports.Visitor = Visitor;
