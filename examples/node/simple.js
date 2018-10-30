"use strict";
exports.__esModule = true;
//import * as state from "@steelbreeze/state";
var state = require("../../lib/node");
state.log.add(function (message) { return console.info(message); }, state.log.Entry | state.log.Exit);
// create the state machine model elements
var model = new state.State("model");
var initial = new state.PseudoState("initial", model, state.PseudoStateKind.Initial);
var stateA = new state.State("stateA", model);
var stateB = new state.State("stateB", model);
// create the state machine model transitions
initial.to(stateA);
stateA.to(stateB).when(function (trigger) { return trigger === "move"; });
// create a state machine instance
var instance = new state.Instance("instance", model);
// send the machine instance a message for evaluation, this will trigger the transition from stateA to stateB
state.evaluate(instance, "move");
