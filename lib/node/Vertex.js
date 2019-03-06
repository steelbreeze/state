"use strict";
exports.__esModule = true;
/**
 * A vertex is an element that can be the source or target of a transition.
 */
var Vertex = /** @class */ (function () {
    function Vertex(name, parent) {
        this.name = name;
        this.parent = parent;
        /**
         * The set of outgoind transitions from the vertex.
         * @internal
         */
        this.outgoing = [];
        this.qualifiedName = parent ? this.parent + "." + name : name;
    }
    Vertex.prototype.isActive = function (instance) {
        return this.parent ? this.parent.parent.isActive(instance) && instance.getVertex(this.parent) === this : true;
    };
    Vertex.prototype.enter = function (instance, deepHistory, trigger) {
        this.enterHead(instance, deepHistory, trigger, undefined);
        this.enterTail(instance, deepHistory, trigger);
    };
    return Vertex;
}());
exports.Vertex = Vertex;
