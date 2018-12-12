import * as state from '../lib/node';
import * as assert from 'assert';
import 'mocha';

state.log.add(message => console.info(message), state.log.Entry | state.log.Exit);

const model = new state.State("model");
const initial = new state.PseudoState("initial", model);
const stateA = new state.State("stateA", model);
const regionA1 = new state.Region("regionA1", stateA);
const regionA2 = new state.Region("regionA2", stateA);
const stateA1a = new state.State("stateA1a", regionA1);
const initialA2 = new state.PseudoState("initialA2", regionA2);
const stateA2a = new state.State("stateA2a", regionA2);

initial.to(stateA1a);
initialA2.to(stateA2a);

let instance = new state.Instance("directEntry", model);

describe('test/directEntry', () => {
	it('Direct entry to a region that is part of an orthogonal state should trigger entry to sibling regions', () => {
		assert.equal(stateA1a, instance.getLastKnownState(regionA1));
		assert.equal(stateA2a, instance.getLastKnownState(regionA2));
	});
});
