"use strict";
/**
 * @module state
 * Finite state machine for TypeScript and JavaScript
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
exports.__esModule = true;
exports.JSONSerializer = exports.Visitor = exports.Instance = exports.Transition = exports.PseudoState = exports.State = exports.Region = exports.Vertex = exports.NamedElement = exports.TransitionKind = exports.PseudoStateKind = exports.random = exports.log = void 0;
var log_1 = require("./log");
__createBinding(exports, log_1, "log");
var random_1 = require("./random");
__createBinding(exports, random_1, "random");
var PseudoStateKind_1 = require("./PseudoStateKind");
__createBinding(exports, PseudoStateKind_1, "PseudoStateKind");
var TransitionKind_1 = require("./TransitionKind");
__createBinding(exports, TransitionKind_1, "TransitionKind");
var NamedElement_1 = require("./NamedElement");
__createBinding(exports, NamedElement_1, "NamedElement");
var Vertex_1 = require("./Vertex");
__createBinding(exports, Vertex_1, "Vertex");
var Region_1 = require("./Region");
__createBinding(exports, Region_1, "Region");
var State_1 = require("./State");
__createBinding(exports, State_1, "State");
var PseudoState_1 = require("./PseudoState");
__createBinding(exports, PseudoState_1, "PseudoState");
var Transition_1 = require("./Transition");
__createBinding(exports, Transition_1, "Transition");
var Instance_1 = require("./Instance");
__createBinding(exports, Instance_1, "Instance");
var Visitor_1 = require("./Visitor");
__createBinding(exports, Visitor_1, "Visitor");
var JSON_1 = require("./JSON");
__createBinding(exports, JSON_1, "JSONSerializer");
