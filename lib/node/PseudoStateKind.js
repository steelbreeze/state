"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PseudoStateKind = void 0;
/**
 * Used to differentiate the various kinds of pseudo state.
 */
var PseudoStateKind;
(function (PseudoStateKind) {
    /**
     * A dynamic conditional branch in compound transitions. The outbound transitions of the choice pseudo state will be evaluated after the transition in; therefore the side effects of any transition behaviour from the incoming transition will be visible to the guard conditions of the outgoing transitions.
     * @remarks If the guard conditions of more than one outbound transition evaluate true a random one will be selected.
     */
    PseudoStateKind[PseudoStateKind["Choice"] = 1] = "Choice";
    /** The staring vertex when entering a region for the first time; subsiquent entry of region will use the last known active state in place of the deep history pseudo state. Likewise, for any child regions, the last known active state will be entered. */
    PseudoStateKind[PseudoStateKind["DeepHistory"] = 2] = "DeepHistory";
    /** The staring vertex when entering a region. There can be at most one transition from an initial pseudo state which will be traversed when the region is entered. */
    PseudoStateKind[PseudoStateKind["Initial"] = 4] = "Initial";
    /** A static conditional branch in compound transitions. The outbound transitions of the junction pseudo state will be evaluated before the transition in; therefore the side effects of any transition behaviour from the incoming transition will not be visible to the guard conditions of the outgoing transitions. */
    PseudoStateKind[PseudoStateKind["Junction"] = 8] = "Junction";
    /** The staring vertex when entering a region for the first time; subsiquent entry of region will use the last known active state in place of the deep history pseudo state. */
    PseudoStateKind[PseudoStateKind["ShallowHistory"] = 16] = "ShallowHistory";
    /**
     * @hidden
     */
    PseudoStateKind[PseudoStateKind["History"] = 18] = "History";
    /**
     * @hidden
     */
    PseudoStateKind[PseudoStateKind["Starting"] = 22] = "Starting";
})(PseudoStateKind = exports.PseudoStateKind || (exports.PseudoStateKind = {}));
