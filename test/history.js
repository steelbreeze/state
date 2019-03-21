/* global describe, it */
var assert = require("assert"),
	state = require("../lib/node");

var model = new state.State("history");

var initial = new state.PseudoState("initial", model, state.PseudoStateKind.Initial);
var shallow = new state.State("shallow", model);
var deep = new state.State("deep", model);
var end = new state.State("final", model);

var s1 = new state.State("s1", shallow);
var s2 = new state.State("s2", shallow);

initial.to(shallow);
new state.PseudoState("shallow", shallow, state.PseudoStateKind.ShallowHistory).to(s1);
s1.to(s2).when(trigger => trigger === "move");
shallow.to(deep).when(trigger => trigger === "go deep");
deep.to(shallow).when(trigger => trigger === "go shallow");
s2.to(end).when(trigger => trigger === "end");

var instance = new state.Instance("history", model);

instance.evaluate("move");
instance.evaluate("go deep");
instance.evaluate("go shallow");
instance.evaluate("end");

describe("test/history.js", function () {
	it("Test should result in a completed state", function () {
		assert.equal(end, instance.getLastKnownState(model.getDefaultRegion()));
	});
});

//setLogger(oldLogger);