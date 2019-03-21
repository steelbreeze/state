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
var _1 = require(".");
/**
 * Represents an element within a state machine model hierarchy that can be the source or target of a transition.
 * Vertices are contained within regions.
 */
var Vertex = /** @class */ (function (_super) {
    __extends(Vertex, _super);
    /**
     * Creates a new instance of the vertex class.
     * @param name The name of the vertex.
     * @param parent The parent region of this vertex.
     * @protected
     */
    function Vertex(name, parent) {
        var _this = _super.call(this, name, parent) || this;
        _this.parent = parent;
        /** The transitions originating from this vertex. */
        _this.outgoing = [];
        if (_this.parent) {
            _this.parent.children.push(_this);
        }
        return _this;
    }
    /**
     * Returns the parent element of this element.
     * @returns Returns the parent element of this element or undefined if the element is the root element of the hierarchy.
     * @internal
     */
    Vertex.prototype.getParent = function () {
        return this.parent;
    };
    /**
     * Creates a new transition at this vertex triggered by an event of a specific type.
     * @param TTrigger The type of the triggering event.
     * @param type The type (class name) of the triggering event.
     * @returns Returns a new typed transition. A typed transition being one whose guard condition and behaviour will accept a parameter of the same type specified.
     * @remarks The generic parameter TTrigger is not generally required as this will be
     */
    Vertex.prototype.on = function (type) {
        return new _1.Transition(this).on(type);
    };
    /**
     * Creates a new transition at this vertex with a guard condition.
     * @param TTrigger The type of the triggering event.
     * @param guard The guard condition to determine if the transition should be traversed.
     * @returns Returns a new transition; if TTrigger is specified, a typed transition will be returned.
     */
    Vertex.prototype.when = function (guard) {
        return new _1.Transition(this).when(guard);
    };
    Vertex.prototype.to = function (target, kind) {
        if (kind === void 0) { kind = _1.TransitionKind.External; }
        return new _1.Transition(this).to(target, kind);
    };
    Vertex.prototype.isActive = function (instance) {
        return this.parent ? instance.getVertex(this.parent) === this : true;
    };
    Vertex.prototype.evaluate = function (instance, history, trigger) {
        var transition = this.getTransition(instance, trigger);
        if (transition) {
            transition.doTraverse(instance, history, trigger);
            return true;
        }
        return false;
    };
    Vertex.prototype.getTransition = function (instance, trigger) {
        return this.outgoing.filter(function (transition) { return transition.evaluate(trigger); })[0]; // TODO: use Array.find
    };
    Vertex.prototype.doEnterHead = function (instance, history, trigger, next) {
        _super.prototype.doEnterHead.call(this, instance, history, trigger, next);
        instance.setVertex(this);
    };
    return Vertex;
}(_1.NamedElement));
exports.Vertex = Vertex;
