"use strict";
exports.__esModule = true;
//import { log, State, PseudoState, PseudoStateKind, Transition, TransitionKind, Instance } from "@steelbreeze/state";
var node_1 = require("../lib/node");
// create event class that a transition will respond to
var MyEvent = /** @class */ (function () {
    function MyEvent(fieldA, fieldB) {
        this.fieldA = fieldA;
        this.fieldB = fieldB;
    }
    MyEvent.prototype.toString = function () {
        return JSON.stringify(this);
    };
    return MyEvent;
}());
// log state entry, exit and trigger event evaluation
node_1.log.add(function (message) { return console.info(message); }, node_1.log.Entry | node_1.log.Exit);
// create the state machine model elements
var model = new node_1.State("model");
var initial = new node_1.PseudoState("initial", model, node_1.PseudoStateKind.Initial);
var stateA = new node_1.State("stateA", model);
var stateB = new node_1.State("stateB", model);
// create the transition from initial pseudo state to stateA
initial.to(stateA);
// create a transtion from stateA to stateB a for events of type MyEvent with a guard condition
stateA.on(MyEvent).when(function (myEvent) { return myEvent.fieldB > 2; }).to(stateB);
// create an instance of the state machine model
var instance = new node_1.Instance("instance", model);
// send the machine events for evaluation
instance.evaluate(new MyEvent("test", 1));
instance.evaluate(new MyEvent("test", 3));
