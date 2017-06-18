"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Enumeration used to define the semantics of [pseudo states]{@link PseudoState}.
 */
var PseudoStateKind;
(function (PseudoStateKind) {
    /*** Turns the [pseudo state]{@link PseudoState} into a dynamic conditional branch: the guard conditions of the outgoing [transitions]{@link Transition} will be evaluated after the transition into the [pseudo state]{@link PseudoState} is traversed. */
    PseudoStateKind[PseudoStateKind["Choice"] = 0] = "Choice";
    /** Turns on deep history semantics for the parent [region]{@link Region}: second and subsiquent entry of the parent [region]{@link Region} will use the last known state from the active state configuration contained withn the [state machine instance]{@link IInstance} as the initial state; this behavior will cascade through all child [regions]{@link Region}. */
    PseudoStateKind[PseudoStateKind["DeepHistory"] = 1] = "DeepHistory";
    /*** Turns the [pseudo state]{@link PseudoState} into an initial [vertex]{@link Vertex}, meaning is is the default point when the parent [region]{@link Region} is entered. */
    PseudoStateKind[PseudoStateKind["Initial"] = 2] = "Initial";
    /*** Turns the [pseudo state]{@link PseudoState} into a static conditional branch: the guard conditions of the outgoing [transitions]{@link Transition} will be evaluated before the transition into the [pseudo state]{@link PseudoState} is traversed. */
    PseudoStateKind[PseudoStateKind["Junction"] = 3] = "Junction";
    /** Turns on shallow history semantics for the parent [region]{@link Region}: second and subsiquent entry of the parent [region]{@link Region} will use the last known state from the active state configuration contained withn the [state machine instance]{@link IInstance} as the initial state; this behavior will only apply to the parent [region]{@link Region}. */
    PseudoStateKind[PseudoStateKind["ShallowHistory"] = 4] = "ShallowHistory";
})(PseudoStateKind = exports.PseudoStateKind || (exports.PseudoStateKind = {}));
(function (PseudoStateKind) {
    /**
     * Tests a [pseudo state kind]{@link PseudoStateKind} to see if it is one of the history kinds.
     * @param kind The [pseudo state kind]{@link PseudoStateKind} to test.
     * @return Returns true if the [pseudo state kind]{@link PseudoStateKind} is [DeepHistory]{@link PseudoStateKind.DeepHistory} or [ShallowHistory]{@link PseudoStateKind.ShallowHistory}
     */
    function isHistory(kind) {
        return kind === PseudoStateKind.DeepHistory || kind === PseudoStateKind.ShallowHistory;
    }
    PseudoStateKind.isHistory = isHistory;
    /**
     * Tests a [pseudo state kind]{@link PseudoStateKind} to see if it is one of the initial kinds.
     * @param kind The [pseudo state kind]{@link PseudoStateKind} to test.
     * @return Returns true if the [pseudo state kind]{@link PseudoStateKind} is [Initial]{@link PseudoStateKind.Initial}, [DeepHistory]{@link PseudoStateKind.DeepHistory} or [ShallowHistory]{@link PseudoStateKind.ShallowHistory}
     */
    function isInitial(kind) {
        return kind === PseudoStateKind.DeepHistory || kind === PseudoStateKind.Initial || kind === PseudoStateKind.ShallowHistory;
    }
    PseudoStateKind.isInitial = isInitial;
})(PseudoStateKind = exports.PseudoStateKind || (exports.PseudoStateKind = {}));
