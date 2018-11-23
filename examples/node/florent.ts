//import * as state from "@steelbreeze/state";
import * as state from "../../lib/node";

state.log.add(message => console.info(message), state.log.Entry | state.log.Exit);

const model = new state.State("model");

const initial = new state.PseudoState("initial", model, state.PseudoStateKind.Initial);
const on = new state.State("on", model);
const off = new state.State("off", model);
const clean = new state.State("clean", model);
const final = new state.State("final", model);
const history = new state.PseudoState("history", on, state.PseudoStateKind.ShallowHistory);
const idle = new state.State("idle", on);
const moveItem = new state.State("moveItem", on);
const showMoveItemPattern = new state.State("showMoveItemPattern", on);
const hideMoveItemPattern = new state.State("hideMoveItemPattern", on);

initial.to(idle);
on.to<String>(off).when(trigger => trigger === "Disable");
off.to<String>(history).when(trigger => trigger === "Enable");
on.to<String>(clean).when(trigger => trigger === "DestroyInput");
off.to<String>(clean).when(trigger => trigger === "DestroyInput");
clean.to<String>(final);
idle.to<String>(moveItem).when(trigger => trigger === "TransformInput");
moveItem.to<String>(idle).when(trigger => trigger === "ReleaseInput");
idle.to<String>(showMoveItemPattern).when(trigger => trigger === "ReleaseInput");
showMoveItemPattern.to<String>(hideMoveItemPattern).when(trigger => trigger === "ReleaseInput");
hideMoveItemPattern.to<String>(idle);

let instance = new state.Instance("florent", model);

instance.evaluate("Disable");
instance.evaluate("Enable");