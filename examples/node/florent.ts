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
on.to(off).when(trigger => trigger === "Disable");
off.to(history).when(trigger => trigger === "Enable");
on.to(clean).when(trigger => trigger === "DestroyInput");
off.to(clean).when(trigger => trigger === "DestroyInput");
clean.to(final);
idle.to(moveItem).when(trigger => trigger === "TransformInput");
moveItem.to(idle).when(trigger => trigger === "ReleaseInput");
idle.to(showMoveItemPattern).when(trigger => trigger === "ReleaseInput");
showMoveItemPattern.to(hideMoveItemPattern).when(trigger => trigger === "ReleaseInput");
hideMoveItemPattern.to(idle);

let instance = new state.Instance("florent", model);

state.evaluate(instance, "Disable");
state.evaluate(instance, "Enable");