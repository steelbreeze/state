"use strict";
exports.__esModule = true;
//import * as state from "@steelbreeze/state";
var state = require("../../lib/node");
// log state entry, exit and trigger event evaluation
state.log.add(function (message) { return console.info(message); }, state.log.Entry | state.log.Exit | state.log.Evaluate);
// create the state machine model
var model = new state.State("model");
var initial = new state.PseudoState("initial", model, state.PseudoStateKind.Initial);
var stateA = new state.State("stateA", model);
var stateB = new state.State("stateB", model);
initial.to(stateA);
stateA.to(stateB).when(function (trigger) { return trigger === "move"; });
// create an instance of the state machine model
var instance = new state.Instance("instance", model);
// send the machine instance a message for evaluation
instance.evaluate("move");
