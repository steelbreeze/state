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
     */
    function Vertex(name, parent) {
        var _this = _super.call(this, name, parent) || this;
        _this.parent = parent;
        /**
         * The transitions originating from this vertex.
         * @internal
         * @hidden
         */
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
     * @hidden
     */
    Vertex.prototype.getParent = function () {
        return this.parent;
    };
    /**
     * Creates a new transition at this vertex triggered by an event of a specific type.
     * @param TTrigger The type of the triggering event; note that this can be derived from the type parameter.
     * @param type The type (class name) of the triggering event.
     * @returns Returns a new typed transition. A typed transition being one whose guard condition and behaviour will accept a parameter of the same type specified.
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
    /**
     * Creates a new transition from this vertex to the target vertex.
     * @param TTrigger The type of the triggering event that the guard will evaluate.
     * @param target The target of the transition.
     * @param kind The kind of the transition, specifying its behaviour.
     * @returns Returns a new transition; if TTrigger is specified, a typed transition will be returned.
     */
    Vertex.prototype.to = function (target, kind) {
        if (kind === void 0) { kind = _1.TransitionKind.External; }
        if (kind === _1.TransitionKind.Internal && target !== this) {
            throw new Error("Internal transitions must have the same source and target states.");
        }
        return new _1.Transition(this).to(target, kind);
    };
    /**
     * Tests the vertex to see if it part of the the active state configuration of a particular state machine instance.
     * @param instance The instance to test.
     * @returns Returns true if this vertex is active in the specified instance.
     * @internal
     * @hidden
     */
    Vertex.prototype.isActive = function (instance) {
        return this.parent === undefined || instance.getVertex(this.parent) === this;
    };
    /**
     * Evaluates a trigger event at this vertex to determine if it will trigger an outgoing transition.
     * @param instance The state machine instance.
     * @param history True if deep history semantics are in play.
     * @param trigger The trigger event.
     * @returns Returns true if one of outgoing transitions guard conditions passed.
     * @internal
     * @hidden
     */
    Vertex.prototype.evaluate = function (instance, history, trigger) {
        var transition = this.getTransition(instance, trigger);
        if (transition) {
            transition.traverse(instance, history, trigger);
            return true;
        }
        return false;
    };
    /**
     * Selects an outgoing transition from this vertex based on the trigger event.
     * @param instance The state machine instance.
     * @param trigger The trigger event.
     * @returns Returns a transition or undefined if none were found.
     * @internal
     * @hidden
     */
    Vertex.prototype.getTransition = function (instance, trigger) {
        return this.outgoing.find(function (transition) { return transition.evaluate(trigger); });
    };
    /**
     * Performs the initial steps required to enter a vertex during a state transition; updates teh active state configuration.
     * @param instance The state machine instance that is entering the element.
     * @param history Flag used to denote deep history semantics are in force at the time of entry.
     * @param trigger The event that triggered the state transition.
     * @internal
     * @hidden
     */
    Vertex.prototype.doEnterHead = function (instance, history, trigger, next) {
        _super.prototype.doEnterHead.call(this, instance, history, trigger, next);
        instance.setVertex(this);
    };
    return Vertex;
}(_1.NamedElement));
exports.Vertex = Vertex;
