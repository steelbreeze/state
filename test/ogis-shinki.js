var state = require("../lib/node");

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
const stateB = new state.State("stateB", model).entry(() => { console.log("hellkow B") }).exit(() => { console.log("bye B") });

// HERE
stateA.entry((trigger, instance) => {
	instance.evaluate(new MyEvent(1, 2));
});

stateA.on(MyEvent).when((e) => { return e.fieldA === 1; }).to(stateB);
stateB.on(MyEvent).when((e) => { return e.fieldA === 1; }).to(stateA);
// create the transition from initial pseudo state to stateA
initial.to(stateA);

let instance = new state.Instance("instance", model);
