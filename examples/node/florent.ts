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
on.on(String).when(trigger => trigger === "Disable").to(off);
off.on(String).when(trigger => trigger === "Enable").to(history);
on.on(String).when(trigger => trigger === "DestroyInput").to(clean);
off.on(String).when(trigger => trigger === "DestroyInput").to(clean);
clean.to(final);
idle.to(moveItem).when(trigger => trigger === "TransformInput").on(String);
moveItem.on(String).when(trigger => trigger === "ReleaseInput").to(idle);
idle.on(String).to(showMoveItemPattern).when(trigger => trigger === "ReleaseInput");
showMoveItemPattern.on(String).when(trigger => trigger === "ReleaseInput").to(hideMoveItemPattern);
hideMoveItemPattern.to(idle);

let instance = new state.Instance("florent", model);

instance.evaluate("Disable");
instance.evaluate("Enable");