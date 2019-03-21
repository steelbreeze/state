/* global describe, it */
var assert = require("assert"),
	state = require("../lib/node");

//state.log.add(message => console.info(message));

const model = new state.State("model");
const initial = new state.PseudoState("initial", model);
const defaultState = new state.State("defaultState", model);

initial.to(defaultState);

defaultState.when((msg) => msg.type === 'abc');

describe("test/fungiboletus.js", function () {
	it("Completion transition evaluation after internal transition should use the source vertex as the trigger event", function () {
		try {
			let instance = new state.Instance("fungiboletus", model);

			instance.evaluate({ type: 'abc', toString() { return "{ type: 'abc' }" } });
		}

		catch (x) {
			assert.fail(`Exception ${x} thrown in initialisation/evaluation`)
		}
	});
});