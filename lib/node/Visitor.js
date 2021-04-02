"use strict";
exports.__esModule = true;
exports.Visitor = void 0;
/**
 * Base for classes implementing the visitor pattern, used to walk a state machine model structure.
 */
var Visitor = /** @class */ (function () {
    function Visitor() {
    }
    /**
     * Called when the visitor starts to visit a state; before child regions are visited.
     * @param state The state being visited.
     */
    Visitor.prototype.visitState = function (state) {
    };
    /**
     * Called when the visitor finishes visiting a state; after child regions are visited.
     * @param state The state being visited.
     */
    Visitor.prototype.visitStateTail = function (state) {
    };
    /**
     * Called when the visitor starts to visit a pseudo state.
     * @param pseudoState The pseudo state being visited.
     */
    Visitor.prototype.visitPseudoState = function (pseduoState) {
    };
    /**
     * Called when the visitor finished visiting a pseudo state.
     * @param pseudoState The pseudo state being visited.
     */
    Visitor.prototype.visitPseudoStateTail = function (pseduoState) {
    };
    /**
     * Called when the visitor starts to visit a region; before child states are visited.
     * @param state The state being visited.
     */
    Visitor.prototype.visitRegion = function (region) {
    };
    /**
     * Called when the visitor finishes visiting a region; after child states are visited.
     * @param state The state being visited.
     */
    Visitor.prototype.visitRegionTail = function (region) {
    };
    return Visitor;
}());
exports.Visitor = Visitor;
