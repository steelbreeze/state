var state = require("../lib/node");
var assert = require("assert");

//state.log.add((message: string) => console.info(message), state.log.Entry | state.log.Exit | state.log.Evaluate);
var e1 = /** @class */ (function () {
	function e1() {
	}
	e1.prototype.toString = function () { return "e1"; };
	return e1;
}());

var e2 = /** @class */ (function () {
	function e2() {
	}
	e2.prototype.toString = function () { return "e2"; };
	return e2;
}());

var e3 = /** @class */ (function () {
	function e3() {
	}
	e3.prototype.toString = function () { return "e3"; };
	return e3;
}());

var e4 = /** @class */ (function () {
	function e4() {
	}
	e4.prototype.toString = function () { return "e4"; };
	return e4;
}());

var model = new state.State("model");
var region = new state.Region("region", model);
var initial = new state.PseudoState("initial", region, state.PseudoStateKind.Initial);
var s1 = new state.State("s1", region);
var s2 = new state.State("s2", region);
var s3 = new state.State("s3", region);
var s4 = new state.State("s4", region);
var s5 = new state.State("s5", region);

s1.defer(e1);
s1.defer(e2);
s1.defer(e3);
s2.defer(e1);
s2.defer(e3);

initial.to(s1);
s1.on(e4).to(s2);
s2.on(e2).to(s3);
s3.on(e1).to(s4);
s3.on(e3).to(s5);

var instance = new state.Instance("redboltz3", model);

instance.evaluate(new e1());
instance.evaluate(new e2());
instance.evaluate(new e3());
instance.evaluate(new e4());

describe('test/redboltz3', function () {
	it('Deferred events are evaluated after completion transitions', function () {
		assert.equal(s4, instance.getLastKnownState(region));
	});
});
