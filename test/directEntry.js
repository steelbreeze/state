"use strict";
exports.__esModule = true;
var state = require("../lib/node");
var assert = require("assert");
require("mocha");
state.log.add(function (message) { return console.info(message); }, state.log.Entry | state.log.Exit);
var model = new state.State("model");
var initial = new state.PseudoState("initial", model);
var stateA = new state.State("stateA", model);
var regionA1 = new state.Region("regionA1", stateA);
var regionA2 = new state.Region("regionA2", stateA);
var stateA1a = new state.State("stateA1a", regionA1);
var initialA2 = new state.PseudoState("initialA2", regionA2);
var stateA2a = new state.State("stateA2a", regionA2);
initial.to(stateA1a);
initialA2.to(stateA2a);
var instance = new state.Instance("directEntry", model);
describe('test/directEntry', function () {
    it('Direct entry to a region that is part of an orthogonal state should trigger entry to sibling regions', function () {
        assert.equal(stateA1a, instance.getLastKnownState(regionA1));
        assert.equal(stateA2a, instance.getLastKnownState(regionA2));
    });
});
