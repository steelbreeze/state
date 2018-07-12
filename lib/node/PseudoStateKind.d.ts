/** Enumeration used to define the semantics of [pseudo states]{@link PseudoState}. */
export declare enum PseudoStateKind {
    /*** Turns the [pseudo state]{@link PseudoState} into a dynamic conditional branch: the guard conditions of the outgoing [transitions]{@link Transition} will be evaluated after the transition into the [pseudo state]{@link PseudoState} is traversed. */
    Choice = 0,
    /** Turns on deep history semantics for the parent [region]{@link Region}: second and subsiquent entry of the parent [region]{@link Region} will use the last known state from the active state configuration contained withn the [state machine instance]{@link IInstance} as the initial state; this behavior will cascade through all child [regions]{@link Region}. */
    DeepHistory = 1,
    /*** Turns the [pseudo state]{@link PseudoState} into an initial [vertex]{@link Vertex}, meaning is is the default point when the parent [region]{@link Region} is entered. */
    Initial = 2,
    /*** Turns the [pseudo state]{@link PseudoState} into a static conditional branch: the guard conditions of the outgoing [transitions]{@link Transition} will be evaluated before the transition into the [pseudo state]{@link PseudoState} is traversed. */
    Junction = 3,
    /** Turns on shallow history semantics for the parent [region]{@link Region}: second and subsiquent entry of the parent [region]{@link Region} will use the last known state from the active state configuration contained withn the [state machine instance]{@link IInstance} as the initial state; this behavior will only apply to the parent [region]{@link Region}. */
    ShallowHistory = 4
}
export declare namespace PseudoStateKind {
    /** Tests a [pseudo state kind]{@link PseudoStateKind} to see if it is one of the history kinds.
     * @param kind The [pseudo state kind]{@link PseudoStateKind} to test.
     * @return Returns true if the [pseudo state kind]{@link PseudoStateKind} is [DeepHistory]{@link PseudoStateKind.DeepHistory} or [ShallowHistory]{@link PseudoStateKind.ShallowHistory}
     */
    function isHistory(kind: PseudoStateKind): boolean;
    /** Tests a [pseudo state kind]{@link PseudoStateKind} to see if it is one of the initial kinds.
     * @param kind The [pseudo state kind]{@link PseudoStateKind} to test.
     * @return Returns true if the [pseudo state kind]{@link PseudoStateKind} is [Initial]{@link PseudoStateKind.Initial}, [DeepHistory]{@link PseudoStateKind.DeepHistory} or [ShallowHistory]{@link PseudoStateKind.ShallowHistory}
     */
    function isInitial(kind: PseudoStateKind): boolean;
}
