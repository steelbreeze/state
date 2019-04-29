/* global describe, it */
var assert = require("assert"),
	state = require("../lib/node");

var model = new state.State("compTest");
var region = new state.Region("region", model);
var initial = new state.PseudoState("initial", region, state.PseudoStateKind.Initial);
var activity1 = new state.State("activity1", region);
var activity2 = new state.State("activity2", region);
var activity3 = new state.State("activity3", region);
var junction1 = new state.PseudoState("junction1", region, state.PseudoStateKind.Junction);
var junction2 = new state.PseudoState("junction2", region, state.PseudoStateKind.Junction);
var end = new state.State("end", region);

var subInitial = new state.PseudoState("subInitial", activity2, state.PseudoStateKind.Initial);
var subEnd = new state.State("subEnd", activity2);

subInitial.to(subEnd);
initial.to(activity1);
activity1.to(activity2);
activity2.to(junction1);
junction1.else(junction2);
junction2.else(activity3);
activity3.to(end);

var instance = new state.Instance("transitions", model);

describe("test/transitions.js", function () {
	it("Completion transitions should be triggered by state entry", function () {
		assert.equal(end, instance.getState(region));
	});
});

//setLogger(oldLogger);