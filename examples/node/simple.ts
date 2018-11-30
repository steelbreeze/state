//import { log, State, PseudoState, PseudoStateKind, Transition, TransitionKind, Instance } from "@steelbreeze/state";
import { log, State, PseudoState, PseudoStateKind, Transition, TransitionKind, Instance } from "../../lib/node";

// log state entry, exit and trigger event evaluation
log.add(message => console.info(message), log.Entry | log.Exit | log.Evaluate);

// create the state machine model elements
const model = new State("model");
const initial = new PseudoState("initial", model, PseudoStateKind.Initial);
const stateA = new State("stateA", model);
const stateB = new State("stateB", model);

// create the state machine model transitions
new Transition(initial, stateA);
new Transition(stateA, stateB, TransitionKind.external, String, s => s === "move");

// create an instance of the state machine model
let instance = new Instance("instance", model);

// send the machine instance a message for evaluation
instance.evaluate("move");
