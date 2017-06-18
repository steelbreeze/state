"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Enumeration used to define the semantics of [transitions]{@link Transition}.
 */
var TransitionKind;
(function (TransitionKind) {
    /** An external [transition]{@link Transition} is the default transition type; the source [vertex]{@link Vertex} is exited, [transition]{@link Transition} behavior called and target [vertex]{@link Vertex} entered. Where the source and target [vertices]{@link Vertex} are in different parent [regions]{@link Region} the source ancestry is exited up to but not including the least common ancestor; likewise the targe ancestry is enterd. */
    TransitionKind[TransitionKind["External"] = 0] = "External";
    /**
     * An internal [transition]{@link Transition} executes without exiting or entering the [state]{@link State} in which it is defined.
     * @note The target vertex of an internal [transition]{@link Transition} must be undefined.
     */
    TransitionKind[TransitionKind["Internal"] = 1] = "Internal";
    /** A local [transition]{@link Transition} is one where the target [vertex]{@link Vertex} is a child of the source [vertex]{@link Vertex}; the source [vertex]{@link Vertex} is not exited. */
    TransitionKind[TransitionKind["Local"] = 2] = "Local";
})(TransitionKind = exports.TransitionKind || (exports.TransitionKind = {}));
