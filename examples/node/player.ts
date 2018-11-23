//import * as state from "@steelbreeze/state";
import * as state from "../../lib/node";

state.log.add(message => console.info(message), state.log.Entry | state.log.Exit);

// create the state machine model elements
const model = new state.State("model");
const initial = new state.PseudoState("initial", model, state.PseudoStateKind.Initial);
const operational = new state.State("operational", model);
const flipped = new state.State("flipped", model);
const finalState = new state.State("final", model);
const deepHistory = new state.PseudoState("history", operational, state.PseudoStateKind.DeepHistory);
const stopped = new state.State("stopped", operational);
const active = new state.State("active", operational).entry(trigger => console.log(`- Engage head due to ${trigger}`)).exit(trigger => console.log(`- Disengage head due to ${trigger}`));
const running = new state.State("running", active).entry(trigger => console.log(`- Start motor due to ${trigger}`)).exit(trigger => console.log(`- Stop motor due to ${trigger}`));
const paused = new state.State("paused", active);

// create the state machine model transitions
initial.to(operational);
deepHistory.to(stopped);
stopped.to<String>(running).when(trigger => trigger === "play");
active.to<String>(stopped).when(trigger => trigger === "stop");
running.to<String>(paused).when(trigger => trigger === "pause");
paused.to<String>(running).when(trigger => trigger === "play");
operational.to<String>(flipped).when(trigger => trigger === "flip");
flipped.to<String>(operational).when(trigger => trigger === "flip");
operational.to<String>(finalState).when(trigger => trigger === "off");

// create a new state machine instance (this stores the active state configuration, allowing many instances to work with a single model)
let instance = new state.Instance("player", model);

// send messages to the state machine to cause state transitions
instance.evaluate("play");
instance.evaluate("pause");
instance.evaluate("flip");
instance.evaluate("flip");
