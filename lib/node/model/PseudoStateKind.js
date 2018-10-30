"use strict";
exports.__esModule = true;
/**
 * The pseudo state kind enumeration determines the behaviour and use of the pseudo state class.
 * @public
 */
var PseudoStateKind;
(function (PseudoStateKind) {
    /**
     * An initial pseudo state is the starting vertex when entering its parent region.
     * @public
     */
    PseudoStateKind[PseudoStateKind["Initial"] = 1] = "Initial";
    /**
     * A shallow history pseudo state is the starting vertex when entering its parent region for the first time;
     *  on re-entry to the parent region the last known state of the region will be entered.
     * @public
     */
    PseudoStateKind[PseudoStateKind["ShallowHistory"] = 2] = "ShallowHistory";
    /**
     * A deep history pseudo state is the starting vertex when entering its parent region for the first time;
     *  on re-entry to the parent region the last known state of the region will be entered.
     *  This re-entry behaviour cascades to all child state.
     * @public
     */
    PseudoStateKind[PseudoStateKind["DeepHistory"] = 4] = "DeepHistory";
    /**
     * A junction is a static conditional branch, allowing transitions to different target states based upon the trigger.
     * As a static conditional branch, the outbound transition guard conditions are tested before the transition into the junction had been traversed.
     * @public
     */
    PseudoStateKind[PseudoStateKind["Junction"] = 8] = "Junction";
    /**
     * A junction is a dynamic conditional branch, allowing transitions to different target states based upon the trigger.
     * As a dynamic conditional branch, the outbound transition guard conditions are tested after the transition into the junction had been traversed.
     * If multiple outbound transitions evaluate true, a random one is selected.
     * @public
     */
    PseudoStateKind[PseudoStateKind["Choice"] = 16] = "Choice";
})(PseudoStateKind = exports.PseudoStateKind || (exports.PseudoStateKind = {}));
/**
 * Branch pseudo states are either junction or choice pseudo states.
 */
exports.Branch = PseudoStateKind.Junction | PseudoStateKind.Choice;
/**
 * History pseudo states are either deep history or shallow history pseudo states.
 */
exports.History = PseudoStateKind.DeepHistory | PseudoStateKind.ShallowHistory;
/**
 * Starting pseudo states are either initial, deep history or shallow history pseudo states.
 */
exports.Starting = PseudoStateKind.Initial | PseudoStateKind.DeepHistory | PseudoStateKind.ShallowHistory;
