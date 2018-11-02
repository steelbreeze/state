/* global describe, it */
var assert = require("assert"),
	state = require("../lib/node/index");

const model = new state.State("model");
const initial = new state.PseudoState("initial", model, state.PseudoStateKind.Initial);
const stateA = new state.State("stateA", model);
const stateB = new state.State("stateB", model);

initial.external(stateA);

let instance = new state.Instance("instance", model);

// TODO: fix up unit tests
describe("test/callbacks.js", function () {
	//	describe("With half the model defined:", function () {
	it("Model will not respond to events", function () {
		assert.equal(false, instance.evaluate("move"));
	});

	describe("With the full model defined:", function () {
		it("Model will respond to events", function () {
			stateA.external(stateB).when(trigger => trigger === "move");

			assert.equal(true, instance.evaluate("move"));
		});
	});
});

//setLogger(oldLogger);