/* global describe, it */
var assert = require("assert"),
	state = require("../lib/node");

var model = new state.State("model");
var region = new state.Region("region", model);
var initial = new state.PseudoState("initial", region, state.PseudoStateKind.Initial);
var state1 = new state.State("state1", region);
var state2 = new state.State("state2", region);

var regionA = new state.Region("regionA", state1);
var initialA = new state.PseudoState("initialA", regionA, state.PseudoStateKind.Initial);
var state3 = new state.State("state3", regionA);
var state8 = new state.State("state8", regionA);

var regionB = new state.Region("regionB", state1);
var initialB = new state.PseudoState("initialB", regionB, state.PseudoStateKind.Initial);
var state4 = new state.State("state4", regionB);
var state5 = new state.State("state5", regionB);

var regionBa = new state.Region("regionBa", state4);
var initialBa = new state.PseudoState("initialBa", regionBa, state.PseudoStateKind.Initial);
var state6 = new state.State("state6", regionBa);

var regionBb = new state.Region("regionBb", state4);
var initialBb = new state.PseudoState("initialBb", regionBb, state.PseudoStateKind.Initial);
var state7 = new state.State("state7", regionBb);

initial.to(state1);
initialA.to(state3);
initialB.to(state4);
initialBa.to(state6);
initialBb.to(state7);

state3.to(state2).when(trigger => trigger === "event2");
state3.to(state8).when(trigger => trigger === "event1");
state7.to(state5).when(trigger => trigger === "event2");
state7.to(state5).when(trigger => trigger === "event1");

var instance = new state.Instance("p3pp3r", model);

describe("test/p3pp3r.js", function () {
	it("All regions of orthogonal state must be exited during the to transition", function () {
		instance.evaluate("event2");

		assert.equal(state2, instance.getLastKnownState(region));
		assert.equal(state4, instance.getLastKnownState(regionB));
	});
});

//setLogger(oldLogger);