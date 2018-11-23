import * as state from '../lib/node';
import * as assert from 'assert';
import 'mocha';

//state.log.add((message: string) => console.info(message), state.log.Entry | state.log.Exit | state.log.Evaluate);

class e1 { public toString(): string { return "e1"; } }
class e2 { public toString(): string { return "e2"; } }
class e3 { public toString(): string { return "e3"; } }
class e4 { public toString(): string { return "e4"; } }

const model = new state.State("model");
const region = new state.Region("region", model);
const initial = new state.PseudoState("initial", region, state.PseudoStateKind.Initial);
const s1 = new state.State("s1", region);
const s2 = new state.State("s2", region);
const s3 = new state.State("s3", region);
const s4 = new state.State("s4", region);
const s5 = new state.State("s5", region);

s1.defer(e1);
s1.defer(e2);
s1.defer(e3);

s2.defer(e1);
s2.defer(e3);

initial.to(s1);
s1.to(s2).on(e4);
s2.to(s3).on(e2);
s3.to(s4).on(e1);
s3.to(s5).on(e3);

let instance = new state.Instance("redboltz3", model);

instance.evaluate(new e1());
instance.evaluate(new e2());
instance.evaluate(new e3());
instance.evaluate(new e4());

describe('test/redboltz3', () => {
	it('Deferred events are evaluated after completion transitions', () => {
		assert.equal(s4, instance.getLastKnownState(region));
	});
});
