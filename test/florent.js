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

initial.to(idle);
on.to(off).when(trigger => trigger === "Disable");
off.to(history).when(trigger => trigger === "Enable");
on.to(clean).when(trigger => trigger === "DestroyInput");
off.to(clean).when(trigger => trigger === "DestroyInput");
clean.to(final);
idle.to(moveItem).when(trigger => trigger=== "TransformInput" );
moveItem.to(idle).when(trigger => trigger === "ReleaseInput" );
idle.to(showMoveItemPattern).when(trigger => trigger === "ReleaseInput" );
showMoveItemPattern.to(hideMoveItemPattern).when(trigger => trigger === "ReleaseInput");
hideMoveItemPattern.to(idle);

var instance = new state.Instance("florent", model);

describe("test/florent.js", function () {
	it("History semantics should set the regions active state configuration to the last known state", function () {
		instance.evaluate("ReleaseInput");
		instance.evaluate("Disable");
		instance.evaluate("Enable");

		assert.equal(showMoveItemPattern, instance.getLastKnownState(onRegion));

		instance.evaluate("ReleaseInput");
		instance.evaluate("Disable");
		instance.evaluate("Enable");

		assert.equal(idle, instance.getLastKnownState(onRegion));
	});
});

//setLogger(oldConsole);