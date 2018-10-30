/* global describe, it */
var assert = require("assert"),
	state = require("../lib/node/index");

// this test overrides the default implementation of the random selector for choices as we're not looking to test the randomness of hte numbers, but the application of them to choose different transtiions therefore we need to turn the non-deterministic into something deterministic
let nextRand = 0;

function randRobin(max) {
	var result = nextRand;

	if (++nextRand === max) {
		nextRand = 0;
	}

	return result;
}

const model = new state.State("model");
const initial = new state.PseudoState("initial", model, state.PseudoStateKind.Initial);
const stateA = new state.State("stateA", model);
const choice = new state.PseudoState("choice", model, state.PseudoStateKind.Choice);

initial.external(stateA);

stateA.external(choice).when(trigger => trigger && trigger.event === "choose");

choice.external(stateA).effect(trigger => trigger.data.path1++);
choice.external(stateA).effect(trigger => trigger.data.path2++);
choice.external(stateA).effect(trigger => trigger.data.path3++);

describe("test/choice.js", function () {

	describe("With an random distribution, we process all messages (and test the true random nature)", function () {
		let instance1 = new state.Instance("instance1", model);
		let trigger1 = { event: "choose", data: { path1: 0, path2: 0, path3: 0 } };

		for (let i = 0; i < 99; i++) {
			state.evaluate(instance1, trigger1);
		}

		it("choice pseudo state transitions all selected randomly", function () {
			assert.equal(99, trigger1.data.path1 + trigger1.data.path2 + trigger1.data.path3);
		});
	});

	describe("With an non-random distribution, each path is called equally", function () {
		const oldRandom = state.random.set(randRobin);

		let instance2 = new state.Instance("instance2", model);
		let trigger2 = { event: "choose", data: { path1: 0, path2: 0, path3: 0 } };

		for (var i = 0; i < 99; i++) {
			state.evaluate(instance2, trigger2);
		}

		it("choice pseudo state transition selection alignmed to random function used", function () {
			assert.equal(33, trigger2.data.path1);
			assert.equal(33, trigger2.data.path2);
			assert.equal(33, trigger2.data.path3);
		});

		state.random.set(oldRandom);
	});
});
