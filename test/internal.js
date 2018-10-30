/* global describe, it */
var assert = require("assert"),
	state = require("../lib/node/index");

//state.log.add(m => console.info(m));

var entryCount = 0;
var exitCount = 0;
var transitionCount = 0;

var model = new state.State("model");
var region = new state.Region("region", model);
var initial = new state.PseudoState("initial", region, state.PseudoStateKind.Initial);
var target = new state.State("state", region).entry(trigger => entryCount++).exit(trigger => exitCount++);

initial.external(target);

target.internal().when(trigger => trigger === "internal").effect(trigger => transitionCount++);
target.external(target).when(trigger => trigger === "external").effect(trigger => transitionCount++);

var instance = new state.Instance("internal", model);

describe("test/internal.js", function () {
	it("Internal transitions do not trigger a state transition", function () {
		state.evaluate(instance, "internal");

		assert.equal(target, instance.getLastKnownState(region));
		assert.equal(1, entryCount);
		assert.equal(0, exitCount);
		assert.equal(1, transitionCount);
	});

	it("External transitions do trigger a state transition", function () {

		state.evaluate(instance, "external");

		assert.equal(target, instance.getLastKnownState(region));
		assert.equal(2, entryCount);
		assert.equal(1, exitCount);
		assert.equal(2, transitionCount);
	});
});
