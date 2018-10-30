/* global describe, it */
var assert = require("assert"),
	state = require("../lib/node/index");

var model = new state.State("model");
var initial = new state.PseudoState("initial", model);
var on = new state.State("on", model);
var onRegion = new state.Region("onRegion", on);
var off = new state.State("off", model);
var clean = new state.State("clean", model);
var final = new state.State("final", model);
var history = new state.PseudoState("history", onRegion, state.PseudoStateKind.ShallowHistory);
var idle = new state.State("idle", onRegion);
var moveItem = new state.State("moveItem", onRegion);
var showMoveItemPattern = new state.State("showMoveItemPattern", onRegion);
var hideMoveItemPattern = new state.State("hideMoveItemPattern", onRegion);

initial.external(idle);
on.external(off).when(trigger => trigger === "Disable");
off.external(history).when(trigger => trigger === "Enable");
on.external(clean).when(trigger => trigger === "DestroyInput");
off.external(clean).when(trigger => trigger === "DestroyInput");
clean.external(final);
idle.external(moveItem).when(trigger => trigger=== "TransformInput" );
moveItem.external(idle).when(trigger => trigger === "ReleaseInput" );
idle.external(showMoveItemPattern).when(trigger => trigger === "ReleaseInput" );
showMoveItemPattern.external(hideMoveItemPattern).when(trigger => trigger === "ReleaseInput");
hideMoveItemPattern.external(idle);

var instance = new state.Instance("florent", model);

describe("test/florent.js", function () {
	it("History semantics should set the regions active state configuration to the last known state", function () {
		state.evaluate(instance, "ReleaseInput");
		state.evaluate(instance, "Disable");
		state.evaluate(instance, "Enable");

		assert.equal(showMoveItemPattern, instance.getLastKnownState(onRegion));

		state.evaluate(instance, "ReleaseInput");
		state.evaluate(instance, "Disable");
		state.evaluate(instance, "Enable");

		assert.equal(idle, instance.getLastKnownState(onRegion));
	});
});

//setLogger(oldConsole);