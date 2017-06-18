/**
 * Enumeration used to define the semantics of [transitions]{@link Transition}.
 */
export declare enum TransitionKind {
    /** An external [transition]{@link Transition} is the default transition type; the source [vertex]{@link Vertex} is exited, [transition]{@link Transition} behavior called and target [vertex]{@link Vertex} entered. Where the source and target [vertices]{@link Vertex} are in different parent [regions]{@link Region} the source ancestry is exited up to but not including the least common ancestor; likewise the targe ancestry is enterd. */
    External = 0,
    /**
     * An internal [transition]{@link Transition} executes without exiting or entering the [state]{@link State} in which it is defined.
     * @note The target vertex of an internal [transition]{@link Transition} must be undefined.
     */
    Internal = 1,
    /** A local [transition]{@link Transition} is one where the target [vertex]{@link Vertex} is a child of the source [vertex]{@link Vertex}; the source [vertex]{@link Vertex} is not exited. */
    Local = 2,
}
