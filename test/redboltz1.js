"use strict";
exports.__esModule = true;
var state = require("../lib/node");
var assert = require("assert");
require("mocha");
state.log.add(function (message) { return console.info(message); }, state.log.Entry | state.log.Exit | state.log.Evaluate);
var Event1 = /** @class */ (function () {
    function Event1(name) {
        this.name = name;
    }
    Event1.prototype.toString = function () { return this.name; };
    return Event1;
}());
var Event2 = /** @class */ (function () {
    function Event2(name) {
        this.name = name;
    }
    Event2.prototype.toString = function () { return this.name; };
    return Event2;
}());
var model = new state.State("model");
var region = new state.Region("region", model);
var initial = new state.PseudoState("initial", region, state.PseudoStateKind.Initial);
var state1 = new state.State("state1", region);
var state2 = new state.State("state2", region);
var state3 = new state.State("state3", region);
var state4 = new state.State("state4", region);
var state5 = new state.State("state5", region);
var state6 = new state.State("state6", region);
state1.defer(Event1);
state2.defer(Event1);
initial.to(state1);
state1.on(Event2).to(state2);
state2.on(Event2).to(state3);
state3.on(Event1).to(state4);
state4.on(Event1).to(state5);
state5.on(Event1).to(state6);
var instance = new state.Instance("redboltz1", model);
instance.evaluate(new Event1("event1a"));
instance.evaluate(new Event1("event1b"));
instance.evaluate(new Event2("event2a"));
instance.evaluate(new Event2("event2b"));
describe('test/redboltz1', function () {
    it('States can defer events for subsiquent evaluation', function () {
        assert.equal(state5, instance.getLastKnownState(region));
    });
});
