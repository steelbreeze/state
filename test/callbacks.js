/* global describe, it */
var assert = require("assert"),
	state = require("../lib/node/index");

//var oldLogger = setLogger({ log: function (message) { instance.logs++; } });

let calls = 0;

const model = new state.State("callbacks_model");
const initial = new state.PseudoState("initial", model, state.PseudoStateKind.Initial);
const stateA = new state.State("stateA", model).exit(trigger => calls += 1);
const stateB = new state.State("stateB", model).entry(trigger => calls += 2);

initial.to(stateA);
stateA.to(stateB).when(trigger => trigger === "move").do(trigger => calls += 4);

var instance = new state.Instance("callbacks", model);

instance.evaluate("move");

describe("test/callbacks.js", function () {
	describe("User defined behavior", function () {
		it("State exit behavior called", function () {
			assert.equal(1, 1 & calls);
		});

		it("State entry behavior called", function () {
			assert.equal(2, 2 & calls);
		});

		it("State transition behavior called", function () {
			assert.equal(4, 4 & calls);
		});
	});
});
/*
describe("Custom logging", function () {
	it("Logger called during initialisation and state transitions", function () {
		assert.equal(9, instance.logs);
	});
});
*/
//setLogger(oldLogger);