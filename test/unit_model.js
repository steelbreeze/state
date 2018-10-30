var assert = require("assert"),
	state = require("../lib/node/index");

var model = new state.State("unit_model");
var initial = new state.PseudoState("initial", model);
var stateA = new state.State("stateA", model).exit(trigger => console.info("Exit A"));
var stateB = new state.State("stateB", model);

initial.to(stateA);
stateA.to(stateB).when(trigger => trigger === "move");

//var instance = new state.Instance("unit_instance", model);

//model.evaluate(instance, "move");

// TODO: add some tests