var state = require('../lib/node/index.js');

var model = new state.State('model');
var initial = new state.PseudoState('initial', model, state.PseudoStateKind.Initial);
var a = new state.State('a', model);
var b = new state.State('b', model);
var aa = new state.State('aa', a);
var aChoice = new state.PseudoState('aChoice', a, state.PseudoStateKind.Choice);

initial.external(aa);
aa.external(aChoice);
aChoice.external(b);

var instance = new state.Instance('instance', model);

// TODO: add test criteria