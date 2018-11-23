//import * as state from "@steelbreeze/state";
import * as state from "../../lib/node";

// log state entry, exit and trigger event evaluation
state.log.add(message => console.info(message), state.log.Entry | state.log.Exit | state.log.Evaluate);

// create the state machine model elements
const model = new state.State("model");
const initial = new state.PseudoState("initial", model, state.PseudoStateKind.Initial);
const stateA = new state.State("stateA", model);
const stateB = new state.State("stateB", model);

// create the state machine model transitions
initial.to(stateA);
stateA.on(String).if(event => event === "move").to(stateB);

// create an instance of the state machine model
let instance = new state.Instance("instance", model);

// send the machine instance a message for evaluation
instance.evaluate("move");
