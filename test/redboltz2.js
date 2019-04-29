var state = require("../lib/node");
var assert = require("assert");

//state.log.add((message: string) => console.info(message), state.log.Entry | state.log.Exit | state.log.Evaluate);
var Event1 = /** @class */ (function () {
    function Event1(name) {
        this.name = name;
    }
    Event1.prototype.toString = function () { return this.name; };
    return Event1;
}());

var Event2 = /** @class */ (function () {
    function Event2(name) {
        this.name = name;
    }
    Event2.prototype.toString = function () { return this.name; };
    return Event2;
}());

var model = new state.State("model");
var region = new state.Region("region", model);
var initial = new state.PseudoState("initial", region, state.PseudoStateKind.Initial);
var state1 = new state.State("state1", region);
var state2 = new state.State("state2", region);
var state3 = new state.State("state3", region);
var state4 = new state.State("state4", region);
var state5 = new state.State("state5", region);

state1.defer(Event1);

initial.to(state1);
state1.on(Event2).to(state2);
state2.to(state3);
state2.on(Event1).to(state5);
state3.on(Event1).to(state4);


var instance = new state.Instance("redboltz2", model);

instance.evaluate(new Event1("event1"));
instance.evaluate(new Event2("event2"));

describe('test/redboltz2', function () {
    it('Deferred events are evaluated after completion transitions', function () {
        assert.equal(state4, instance.getState(region));
    });
});
