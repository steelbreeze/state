"use strict";
exports.__esModule = true;
exports.TransitionKind = void 0;
/**
 * Specifies the behaviour of transitions.
 */
var TransitionKind;
(function (TransitionKind) {
    /** External transitions are the default transition type; the source vertex is exited, transition behaviour performed and the target entered. */
    TransitionKind[TransitionKind["External"] = 0] = "External";
    /** An internal transition does not exit the source state; it only performs transition behaviour. */
    TransitionKind[TransitionKind["Internal"] = 1] = "Internal";
    /** A Local transition is one where the target vertex is in the child structure of the source; the source state is not exited. */
    TransitionKind[TransitionKind["Local"] = 2] = "Local";
})(TransitionKind = exports.TransitionKind || (exports.TransitionKind = {}));
