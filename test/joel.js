var state = require('../lib/node'),
    assert = require('assert');

let log = [];
var logger = state.log.add(message => log.push(message), state.log.Entry | state.log.Exit);

var model = new state.State('model');
var initial = new state.PseudoState('initial', model, state.PseudoStateKind.Initial);
var a = new state.State('a', model);
var b = new state.State('b', model);
var aa = new state.State('aa', a);
var aChoice = new state.PseudoState('aChoice', a, state.PseudoStateKind.Choice);

initial.to(aa);
aa.when(trigger => trigger === "stay");
aa.to(aChoice).when(trigger => trigger === "move");
aChoice.to(b);

var instance = new state.Instance('instance', model);

instance.evaluate("stay");
instance.evaluate("move");

state.log.remove(logger);

describe("test/joel.js", function () {
	it("When a regions leaves via a pseudo state, than pseudo state is left and not the last known state", function () {
		assert.equal(`${instance} leave ${aChoice}`, log[9]);
	});
});
