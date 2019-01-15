//var state = require("@steelbreeze/state");
var state = require("../../lib/node");

// create event class that a transition will respond to
class MyEvent {
	constructor(fieldA, fieldB) { this.fieldA = fieldA; this.fieldB = fieldB; }

	toString() { return JSON.stringify(this); }
}

// log state entry, exit and trigger event evaluation
state.log.add(message => console.info(message), state.log.Entry | state.log.Exit | state.log.Evaluate);

// create the state machine model elements
const model = new state.State("model");
const initial = new state.PseudoState("initial", model, state.PseudoStateKind.Initial);
const stateA = new state.State("stateA", model);
const stateB = new state.State("stateB", model);

// create the transition from initial pseudo state to stateA
initial.to(stateA);

// create a transtion from stateA to stateB a for events of type MyEvent with a guard condition
stateA.on(MyEvent).when(myEvent => myEvent.fieldB > 2).to(stateB);

// create an instance of the state machine model
let instance = new state.Instance("instance", model);

// send the machine events for evaluation
instance.evaluate(new MyEvent("test", 1));
instance.evaluate(new MyEvent("test", 3));
