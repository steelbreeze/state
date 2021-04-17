const state = require("../lib/node");

state.log.add(function (message) { console.info(message); }, state.log.Entry | state.log.Exit | state.log.Evaluate);

const model = new state.State("model");
const region = new state.Region("region", model);
const initial = new state.PseudoState("initial", region);
const choice = new state.PseudoState("choice", region, state.PseudoStateKind.Choice);
const junction = new state.PseudoState("junction", region, state.PseudoStateKind.Junction);
const finalState = new state.State("final", region);

var data = {};

initial.to(choice);
choice.to(junction).when(trigger => !data.hello).effect(() => {console.log("VVVVV"); data.hello = "hello"; });
choice.else(finalState);
junction.to(choice).when(trigger => !data.world).effect(() => { console.log("FFFF"); data.world = "world"; });

var instance = new state.Instance("instance", model);

console.log(data);

/*
describe("test/else.js", function () {
	it("Test should result in a completed state", function () {
		assert.strictEqual(finalState, instance.get(region));
	});

	it("Else from choice transition fired appropriately", function () {
		assert.strictEqual("hello", data.hello);
	});

	it("Else from junction transition fired appropriately", function () {
		assert.strictEqual("world", data.world);
	});
});
*/