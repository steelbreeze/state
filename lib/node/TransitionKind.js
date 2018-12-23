"use strict";
exports.__esModule = true;
var ExternalTransitionActivation_1 = require("./ExternalTransitionActivation");
var LocalTransitionActivation_1 = require("./LocalTransitionActivation");
var InternalTransitionActivation_1 = require("./InternalTransitionActivation");
var TransitionKind;
(function (TransitionKind) {
    /**
     * An external transition is the default transition kind between any two vertices (states or pseudo states).
     * Upon traversal it will: exit the source vertex and any parent elements (vertex or region) up to, but not including the common ancestor of the source and target;
     * it will then perform and user defined transition behaviour;
     * finally, it will enter the target vertex, having first entered any parent elements below the common ancestor as needed.
     * If the source or target vertices are not leaf-level elements within the state machine hierarchy, the exit or entry operation will cascate to child elements as needed.
     */
    TransitionKind[TransitionKind["external"] = 0] = "external";
    /**
     * A local transition is one where either the source or target is the common ancestor of both vertices.
     * Traversal is the same as an external transition but the common ancestor is not entered/exited.
     */
    TransitionKind[TransitionKind["local"] = 1] = "local";
    /**
     * An internal transition does not cause a change of state; when traversed it only executes the user defined transition behaviour.
     */
    TransitionKind[TransitionKind["internal"] = 2] = "internal";
})(TransitionKind = exports.TransitionKind || (exports.TransitionKind = {}));
(function (TransitionKind) {
    /**
     * Map from transition kind to the transition activation strategies.
     */
    TransitionKind.map = [ExternalTransitionActivation_1.ExternalTransitionActivation, LocalTransitionActivation_1.LocalTransitionActivation, InternalTransitionActivation_1.InternalTransitionActivation];
})(TransitionKind = exports.TransitionKind || (exports.TransitionKind = {}));
