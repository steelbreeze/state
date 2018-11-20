"use strict";
exports.__esModule = true;
var state = require("../lib/node");
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
state1.to(state2).on(Event2);
state2.to(state3).on(Event2);
state3.to(state4).on(Event1);
state4.to(state5).on(Event1);
state5.to(state6).on(Event1);
var instance = new state.Instance("redboltz1", model);
instance.evaluate(new Event1("event1a"));
instance.evaluate(new Event1("event1b"));
instance.evaluate(new Event2("event2a"));
instance.evaluate(new Event2("event2b"));
