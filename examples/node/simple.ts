//import * as state from "@steelbreeze/state";
import * as state from "../../lib/node";

state.log.add(message => console.info(message), state.log.Entry | state.log.Exit);

// create the state machine model elements
const model = new state.State("model");
const initial = new state.PseudoState("initial", model, state.PseudoStateKind.Initial);
const stateA = new state.State("stateA", model);
const stateB = new state.State("stateB", model);

// create the state machine model transitions
initial.to(stateA);
stateA.to(stateB).when(trigger => trigger === "move");

// create a state machine instance
let instance = new state.Instance("instance", model);

// send the machine instance a message for evaluation, this will trigger the transition from stateA to stateB
state.evaluate(instance, "move");
