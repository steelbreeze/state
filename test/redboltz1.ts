import * as state from '../lib/node';

state.log.add((message: string) => console.info(message), state.log.Entry | state.log.Exit | state.log.Evaluate);

class Event1 { public constructor(public readonly name: string) { } public toString(): string { return this.name; } }
class Event2 { public constructor(public readonly name: string) { } public toString(): string { return this.name; } }

const model = new state.State("model");
const region = new state.Region("region", model);
const initial = new state.PseudoState("initial", region, state.PseudoStateKind.Initial);
const state1 = new state.State("state1", region);
const state2 = new state.State("state2", region);
const state3 = new state.State("state3", region);
const state4 = new state.State("state4", region);
const state5 = new state.State("state5", region);
const state6 = new state.State("state6", region);

state1.defer(Event1);
state2.defer(Event1);

initial.to(state1);
state1.to(state2).on(Event2);
state2.to(state3).on(Event2);
state3.to(state4).on(Event1);
state4.to(state5).on(Event1);
state5.to(state6).on(Event1);

let instance = new state.Instance("redboltz1", model);

instance.evaluate(new Event1("event1a"));
instance.evaluate(new Event1("event1b"));
instance.evaluate(new Event2("event2a"));
instance.evaluate(new Event2("event2b"));