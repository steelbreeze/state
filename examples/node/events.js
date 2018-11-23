"use strict";
exports.__esModule = true;
// This example shows a model with orthogonal regions, each one waiting on a different event
// before the machine completes (a region is deemed complete when it reaches a state with no outgoing transitions).
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
// create a simple machine in which the waiting state must be 'complete' in order to transition to the done state.
var model = new node_1.State("model");
var initial = new node_1.PseudoState("initial", model, node_1.PseudoStateKind.Initial);
var waiting = new node_1.State("waiting", model);
var complete = new node_1.State("complete", model).entry(function () { return console.info("Received both events"); });
initial.to(waiting);
waiting.to(complete);
// create a child region which becomes complete once it has received event A.
var regionA = new node_1.Region("regionA", waiting);
var initialA = new node_1.PseudoState("initialA", regionA, node_1.PseudoStateKind.Initial);
var waitingA = new node_1.State("waitingA", regionA);
var completeA = new node_1.State("completeA", regionA).entry(function () { return console.info("Received event A"); });
initialA.to(waitingA);
waitingA.on(Event)["if"](function (event) { return event.is("A"); }).to(completeA);
// create a child region which becomes complete once it has received event B.
var regionB = new node_1.Region("regionB", waiting);
var initialB = new node_1.PseudoState("initialB", regionB, node_1.PseudoStateKind.Initial);
var waitingB = new node_1.State("waitingB", regionB);
var completeB = new node_1.State("completeB", regionB).entry(function () { return console.info("Received event B"); });
initialB.to(waitingB);
waitingB.on(Event).to(completeB)["if"](function (event) { return event.is("B"); });
// create an instance of the state machine
var instance = new node_1.Instance("instance", model);
// evaluate events
instance.evaluate(new Event("A"));
instance.evaluate(new Event("B"));
