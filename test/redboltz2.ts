import * as state from '../lib/node';
import * as assert from 'assert';
import 'mocha';

//state.log.add((message: string) => console.info(message), state.log.Entry | state.log.Exit | state.log.Evaluate);

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

state1.defer(Event1);

// use explicit transition creation rather than fluent API
new state.Transition(initial, state1);
new state.Transition(state1, state2, state.TransitionKind.external, Event2);
new state.Transition(state2, state3);
new state.Transition(state2, state5, state.TransitionKind.external, Event1);
new state.Transition(state3, state4, state.TransitionKind.external, Event1);

let instance = new state.Instance("redboltz2", model);

instance.evaluate(new Event1("event1"));
instance.evaluate(new Event2("event2"));

describe('test/redboltz2', () => {
	it('Deferred events are evaluated after completion transitions', () => {
		assert.equal(state4, instance.getLastKnownState(region));
	});
});
