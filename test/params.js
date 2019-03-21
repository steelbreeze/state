/* global describe, it */
var assert = require("assert"),
	state = require("../lib/node");

var exitParams = 0;
var entryParams = 0;
var transParams = 0;

var model = new state.State("model");
var initial = new state.PseudoState("initial", model);
var first = new state.State("first", model).exit(trigger => exitParams = trigger.first && trigger.second ? 2 : 0);
var second = new state.State("second", model).entry(trigger => entryParams = trigger.first && trigger.second ? 2 : 0);

initial.to(first);

first.to(second).when(trigger => trigger && trigger.second === "closer").effect(trigger => transParams = trigger.first && trigger.second ? 2 : 0);

var instance = new state.Instance("params", model);

instance.evaluate({first: "move", second: "closer"});

describe("test/params.js", function () {
	it("Multiple parameters available to exit behavior", function () {
		assert.equal(2, exitParams);
	});

	it("Multiple parameters available to entry behavior", function () {
		assert.equal(2, entryParams);
	});

	it("Multiple parameters available to transition behavior", function () {
		assert.equal(2, transParams);
	});
});

//setLogger(oldLogger);