/* global describe, it */
var assert = require("assert"),
	state = require("../lib/node/index");

//state.log.add(message => console.info(message));

// create the state machine model
const model = new state.State("model");
const region = new state.Region("region", model);
const initial = new state.PseudoState("initial", region);
const S1 = new state.State("s1", region);
const S2 = new state.State("s2", region);

let i = 0;

// initial transition
initial.external(S1);

// IT transition
S1.internal().when(trigger => i === 0).effect(trigger => i++);

// T transition
S1.external(S2).when(trigger => i > 0);

// create the state machine instance and initialise it
var instance = new state.Instance("brice2", model);

// assertions
describe("test/brice2.js", function () {
	it("Internal transitions are evaluated on completion events", function () {
		assert.equal(1, i);
	});

	it("Internal transitions fire completion events if switch set", function () {
		assert.equal(S2, instance.getLastKnownState(region));
	});
});

//setLogger(oldLogger);