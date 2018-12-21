"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var util_1 = require("./util");
var NamedElement_1 = require("./NamedElement");
/**
 * A vertex is an element that can be the source or target of a transition.
 */
var Vertex = /** @class */ (function (_super) {
    __extends(Vertex, _super);
    function Vertex(name, parent) {
        var _this = _super.call(this, name, parent) || this;
        /**
         * The outgoing transitions available from this vertex.
         */
        _this.outgoing = [];
        return _this;
    }
    /** Accept a trigger and vertex: evaluate the guard conditions of the transitions and traverse if one evaluates true. */
    Vertex.prototype.accept = function (instance, deepHistory, trigger) {
        var result = false;
        var transition = this.getTransition(trigger);
        if (transition) {
            transition.traverse(instance, deepHistory, trigger);
            result = true;
        }
        return result;
    };
    /**
     * Find a transition from the state given a trigger event.
     * @param trigger The trigger event to evaluate transtions against.
     * @returns Returns the trigger or undefined if none are found.
     * @throws Throws an Error if more than one transition was found.
     */
    Vertex.prototype.getTransition = function (trigger) {
        var _this = this;
        var result;
        // iterate through all outgoing transitions of this state looking for a single one whose guard evaluates true
        for (var i = this.outgoing.length; i--;) {
            if (this.outgoing[i].evaluate(trigger)) {
                util_1.assert.ok(!result, function () { return "Multiple transitions found at " + _this + " for " + trigger; });
                result = this.outgoing[i];
            }
        }
        return result;
    };
    return Vertex;
}(NamedElement_1.NamedElement));
exports.Vertex = Vertex;
