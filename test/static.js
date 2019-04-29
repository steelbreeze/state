/* global describe, it */
var assert = require("assert"),
	state = require("../lib/node");

var model = new state.State("model");
var region = new state.Region("region", model);
var initial = new state.PseudoState("initial", region, state.PseudoStateKind.Initial);
var junction1 = new state.PseudoState("junction1", region, state.PseudoStateKind.Junction);
var junction2 = new state.PseudoState("junction2", region, state.PseudoStateKind.Junction);

var pass = new state.State("success", region);
var fail = new state.State("error", region);

var counter = 0;

initial.to(junction1);

junction1.to(junction2).when(trigger => counter === 0).effect(trigger => counter++);
junction1.else(fail);
junction2.to(pass).when(trigger => counter === 0).effect(trigger => counter++);
junction2.else(fail);

var instance = new state.Instance("static", model);

describe("test/static.js", function () {
	it("Junction transitions implement a static conditional branch", function () {
		
		assert.equal(pass, instance.getState(region));
	});

	it("Junction transitions call all transition behavior after guards have been tested", function () {

		assert.equal(2, counter);
	});
});

//setLogger(oldLogger);