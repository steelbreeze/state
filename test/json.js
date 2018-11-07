/* global describe, it */
var assert = require("assert"),
	state = require("../lib/node/index");

const model = new state.State("model");
const region = new state.Region("region", model);
const initial = new state.PseudoState("initialModel", region);
const stateA = new state.State("stateA", region);
const stateB = new state.State("stateB", region);

initial.to(stateA);
stateA.to(stateB);

let instance = new state.Instance("json", model);

describe("JSON tests", function () {
	it("JSON can be produced and represents the current state of the instance", function () {
		const expected = { name: model.name, children: [
			{ name: region.name, children: [
				{ name: stateA.name, children: [] },
				{ name: stateB.name, children: [] }
			], lastKnownState: stateB.name }
		] };

		const actual = instance.toJSON();

		assert.equal(JSON.stringify(expected), JSON.stringify(actual));
	});
});
