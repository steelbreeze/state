/* global describe, it */
var assert = require("assert"),
	state = require("../lib/node/index");

const model = new state.State("model");

const initial = new state.PseudoState("initial", model);

const choice = new state.PseudoState("choice", model, state.PseudoStateKind.Choice);
const junction = new state.PseudoState("junction", model, state.PseudoStateKind.Junction);

const finalState = new state.State("final", model);

var data = {};

initial.to(choice);
choice.to(junction).when(trigger => !data.hello).do(trigger => data.hello = "hello");
choice.else(finalState);
junction.to(choice).when(trigger => !data.world).do(trigger => data.world = "world");

var instance = new state.Instance("instance", model);

describe("test/else.js", function () {
	it("Test should result in a completed state", function () {
		assert.equal(finalState, instance.getLastKnownState(model.getDefaultRegion()));
	});

	it("Else from choice transition fired appropriately", function () {
		assert.equal("hello", data.hello);
	});

	it("Else from junction transition fired appropriately", function () {
		assert.equal("world", data.world);
	});
});

//setLogger(oldLogger);