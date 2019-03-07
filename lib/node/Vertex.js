"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
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
         * The set of outgoind transitions from the vertex.
         * @internal
         */
        _this.outgoing = [];
        if (_this.parent) {
            _this.parent.children.unshift(_this);
        }
        return _this;
    }
    Vertex.prototype.isActive = function (instance) {
        return this.parent ? this.parent.parent.isActive(instance) && instance.getVertex(this.parent) === this : true;
    };
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
    return Vertex;
}(NamedElement_1.NamedElement));
exports.Vertex = Vertex;
