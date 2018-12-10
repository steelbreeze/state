//var state = require("@steelbreeze/state");
var state = require("../../lib/node");

// create event class that a transition will respond to
var MyEvent = (function () {
	function MyEvent(fieldA, fieldB) { this.fieldA = fieldA; this.fieldB = fieldB; }

	MyEvent.prototype.toString = function () { return JSON.stringify(this); };

	return MyEvent;
}());

// log state entry, exit and trigger event evaluation
state.log.add(function (message) { console.info(message); }, state.log.Entry | state.log.Exit | state.log.Evaluate);

// create the state machine model elements
var model = new state.State("model");
var initial = new state.PseudoState("initial", model, state.PseudoStateKind.Initial);
var stateA = new state.State("stateA", model);
var stateB = new state.State("stateB", model);

// create the transition from initial pseudo state to stateA
initial.to(stateA);

// create a transtion from stateA to stateB a for events of type MyEvent with a guard condition
stateA.on(MyEvent).when(function (myEvent) { return myEvent.fieldB > 2; }).to(stateB);

// create an instance of the state machine model
var instance = new state.Instance("instance", model);

// send the machine events for evaluation
instance.evaluate(new MyEvent("test", 1));
instance.evaluate(new MyEvent("test", 3));
