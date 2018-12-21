"use strict";
exports.__esModule = true;
/**
 * The PseudoStateKind enumeration determines the behaviour of PseudoState instances.
 * @public
 */
var PseudoStateKind;
(function (PseudoStateKind) {
    /**
     * An Initial PseudoState is the starting PseudoState when entering its parent Region.
     * @public
     */
    PseudoStateKind["Initial"] = "initial";
    /**
     * A ShallowHistory PseudoState is the starting PseudoState when entering its parent Region for the first time.
     * On re-entry to the parent Region, the last known State of the Region will be used as the starting State.
     * @public
     */
    PseudoStateKind["ShallowHistory"] = "shallow history";
    /**
     * A DeepHistory PseudoState is the starting PseudoState when entering its parent Region for the first time.
     * On re-entry to the parent Region, the last known State of the Region will be used as the stating State.
     * This re-entry behaviour cascades to all child Regions.
     * @public
     */
    PseudoStateKind["DeepHistory"] = "deep history";
    /**
     * A Junction PseudoState is a static conditional branch, allowing transitions to different target States or PseudoStates based upon the trigger event.
     * As a static conditional branch, the outbound transition guard conditions are evaluated before the transition into the junction had been traversed and any incoming transition behaviour called.
     * @public
     */
    PseudoStateKind["Junction"] = "junction";
    /**
     * A Choice PseudoState is a dynamic conditional branch, allowing transitions to different target States or PseudoStates based upon the trigger event.
     * As a dynamic conditional branch, the outbound transition guard conditions are tested after the transition into the junction had been traversed and incoming transition behaviour called.
     * If the guard conditions of multiple outbound transitions evaluate true, a random one is selected.
     * @public
     */
    PseudoStateKind["Choice"] = "choice";
})(PseudoStateKind = exports.PseudoStateKind || (exports.PseudoStateKind = {}));
