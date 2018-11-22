"use strict";
exports.__esModule = true;
var node_1 = require("../../lib/node");
// log state entry, exit and event evaluation
node_1.log.add(function (message) { return console.info(message); }, node_1.log.Entry | node_1.log.Exit | node_1.log.Evaluate);
// create a class to encapsulate events
var Event = /** @class */ (function () {
    function Event(type) {
        this.type = type;
    }
    Event.prototype.is = function (type) {
        return this.type === type;
    };
    Event.prototype.toString = function () {
        return "event " + this.type;
    };
    return Event;
}());
// create a state machine model that only is complete (in done state) when events A and B are received in any order
var model = new node_1.State("model");
var region = new node_1.Region("region", model);
var initial = new node_1.PseudoState("initial", region, node_1.PseudoStateKind.Initial);
var waitAB = new node_1.State("waitAB", region);
var waitA = new node_1.State("waitA", region);
var waitB = new node_1.State("waitB", region);
var done = new node_1.State("done", region).entry(function () { return console.info("Received both events"); });
// create the transitions within the model in the form source.to(target).on(event).if(guard).do(action)
initial.to(waitAB);
waitAB.to(waitB).on(Event)["if"](function (event) { return event.is("A"); });
waitAB.to(waitA).on(Event)["if"](function (event) { return event.is("B"); });
waitB.to(done).on(Event)["if"](function (event) { return event.is("B"); });
waitA.to(done).on(Event)["if"](function (event) { return event.is("A"); });
// create an instance of the state machine
var instance = new node_1.Instance("instance", model);
// evaluate events
instance.evaluate(new Event("B"));
instance.evaluate(new Event("A"));
