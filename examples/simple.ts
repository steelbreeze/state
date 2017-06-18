import * as state from "../state";

const choice = state.PseudoStateKind.Choice;
const initial = state.PseudoStateKind.Initial;

console.log(state.PseudoStateKind.isInitial(choice));
console.log(state.PseudoStateKind.isInitial(initial));