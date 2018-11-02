//var state = require("@steelbreeze/state");
var state = require("../../lib/node")

state.log.add(message => console.info(message), state.log.Entry | state.log.Exit);

// create the state machine model elements
var model = new state.State("model");
var initial = new state.PseudoState("initial", model, state.PseudoStateKind.Initial);
var stateA = new state.State("stateA", model);
var initialA = new state.PseudoState("initialA", stateA, state.PseudoStateKind.Initial);
var stateAA = new state.State("stateAA", stateA);
var stateAB = new state.State("stateAB", stateA);

// create the state machine model transitions
initial.external(stateA);
initialA.external(stateAA);
stateA.local(stateAB).when(trigger => trigger === "move");

// create a state machine instance
var instance = new state.Instance("instance", model);

// send the machine instance a message for evaluation, this will trigger the transition from stateA to stateB
instance.evaluate("move");
