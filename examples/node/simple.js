"use strict";
exports.__esModule = true;
//import { log, State, PseudoState, PseudoStateKind, Transition, TransitionKind, Instance } from "@steelbreeze/state";
var node_1 = require("../../lib/node");
// log state entry, exit and trigger event evaluation
node_1.log.add(function (message) { return console.info(message); }, node_1.log.Entry | node_1.log.Exit | node_1.log.Evaluate);
// create the state machine model elements
var model = new node_1.State("model");
var initial = new node_1.PseudoState("initial", model, node_1.PseudoStateKind.Initial);
var stateA = new node_1.State("stateA", model);
var stateB = new node_1.State("stateB", model);
// create the state machine model transitions
new node_1.Transition(initial, stateA);
new node_1.Transition(stateA, stateB, node_1.TransitionKind.external, String, function (s) { return s === "move"; });
// create an instance of the state machine model
var instance = new node_1.Instance("instance", model);
// send the machine instance a message for evaluation
instance.evaluate("move");
