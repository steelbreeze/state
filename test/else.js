/* global describe, it */
var assert = require("assert"),
	state = require("../lib/node");

const model = new state.State("model");
const region = new state.Region("region", model);
const initial = new state.PseudoState("initial", region);
const choice = new state.PseudoState("choice", region, state.PseudoStateKind.Choice);
const junction = new state.PseudoState("junction", region, state.PseudoStateKind.Junction);
const finalState = new state.State("final", region);

var data = {};

initial.to(choice);
choice.to(junction).when(trigger => !data.hello).effect(trigger => data.hello = "hello");
choice.else(finalState);
junction.to(choice).when(trigger => !data.world).effect(trigger => data.world = "world");

var instance = new state.Instance("instance", model);

describe("test/else.js", function () {
	it("Test should result in a completed state", function () {
		assert.equal(finalState, instance.getState(region));
	});

	it("Else from choice transition fired appropriately", function () {
		assert.equal("hello", data.hello);
	});

	it("Else from junction transition fired appropriately", function () {
		assert.equal("world", data.world);
	});
});

//setLogger(oldLogger);