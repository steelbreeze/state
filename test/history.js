/* global describe, it */
var assert = require("assert"),
	state = require("../lib/node/index");

var model = new state.State("history");

var initial = new state.PseudoState("initial", model, state.PseudoStateKind.Initial);
var shallow = new state.State("shallow", model);
var deep = new state.State("deep", model);
var end = new state.State("final", model);

var s1 = new state.State("s1", shallow);
var s2 = new state.State("s2", shallow);

initial.external(shallow);
new state.PseudoState("shallow", shallow, state.PseudoStateKind.ShallowHistory).external(s1);
s1.external(s2).when(trigger => trigger === "move");
shallow.external(deep).when(trigger => trigger === "go deep");
deep.external(shallow).when(trigger => trigger === "go shallow");
s2.external(end).when(trigger => trigger === "end");

var instance = new state.Instance("history", model);

state.evaluate(instance, "move");
state.evaluate(instance, "go deep");
state.evaluate(instance, "go shallow");
state.evaluate(instance, "end");

describe("test/history.js", function () {
	it("Test should result in a completed state", function () {
		assert.equal(end, instance.getLastKnownState(model.getDefaultRegion()));
	});
});

//setLogger(oldLogger);