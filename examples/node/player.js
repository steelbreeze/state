"use strict";
exports.__esModule = true;
//import * as state from "@steelbreeze/state";
var state = require("../../lib/node");
state.log.add(function (message) { return console.info(message); }, state.log.Entry | state.log.Exit);
// create the state machine model elements
var model = new state.State("model");
var initial = new state.PseudoState("initial", model, state.PseudoStateKind.Initial);
var operational = new state.State("operational", model);
var flipped = new state.State("flipped", model);
var finalState = new state.State("final", model);
var deepHistory = new state.PseudoState("history", operational, state.PseudoStateKind.DeepHistory);
var stopped = new state.State("stopped", operational);
var active = new state.State("active", operational).entry(function (trigger) { return console.log("- Engage head due to " + trigger); }).exit(function (trigger) { return console.log("- Disengage head due to " + trigger); });
var running = new state.State("running", active).entry(function (trigger) { return console.log("- Start motor due to " + trigger); }).exit(function (trigger) { return console.log("- Stop motor due to " + trigger); });
var paused = new state.State("paused", active);
// create the state machine model transitions
initial.to(operational);
deepHistory.to(stopped);
stopped.to(running).when(function (trigger) { return trigger === "play"; });
active.to(stopped).when(function (trigger) { return trigger === "stop"; });
running.to(paused).when(function (trigger) { return trigger === "pause"; });
paused.to(running).when(function (trigger) { return trigger === "play"; });
operational.to(flipped).when(function (trigger) { return trigger === "flip"; });
flipped.to(operational).when(function (trigger) { return trigger === "flip"; });
operational.to(finalState).when(function (trigger) { return trigger === "off"; });
// create a new state machine instance (this stores the active state configuration, allowing many instances to work with a single model)
var instance = new state.Instance("player", model);
// send messages to the state machine to cause state transitions
state.evaluate(instance, "play");
state.evaluate(instance, "pause");
state.evaluate(instance, "flip");
state.evaluate(instance, "flip");
