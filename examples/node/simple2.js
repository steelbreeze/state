//var state = require("@steelbreeze/state");
var state = require("../../lib/node");

state.log.add(message => console.info(message), state.log.Entry | state.log.Exit | state.log.Evaluate);

// create the state machine model
var model = new state.State("model");
var initial = new state.PseudoState("initial", model, state.PseudoStateKind.Initial);
var stateA = new state.State("stateA", model);
var stateB = new state.State("stateB", model);

initial.to(stateA);
stateA.to(stateB).when(trigger => trigger === "move");

// create an instance of the state machine model
var instance = new state.Instance("instance", model);

// send the machine instance a message for evaluation
instance.evaluate("move");
