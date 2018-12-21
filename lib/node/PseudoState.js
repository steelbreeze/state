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
var index_1 = require("./index");
var Vertex_1 = require("./Vertex");
/**
 * A pseudo state is a transient elemement within a state machine, once entered it will evaluate outgoing transitions and attempt to exit.
 * @public
 */
var PseudoState = /** @class */ (function (_super) {
    __extends(PseudoState, _super);
    /**
     * Creates a new instance of the PseudoState class.
     * @param name The name of the pseudo state.
     * @param parent The parent region of the pseudo state; a state may also be specified in which case the state's default region will be used as the parent region.
     * @param kind The kind of pseudo state; this defines its behaviour and use. See PseudoStateKind for more information.
     * @public
     */
    function PseudoState(name, parent, kind) {
        if (kind === void 0) { kind = index_1.PseudoStateKind.Initial; }
        var _this = _super.call(this, name, parent instanceof index_1.State ? parent.getDefaultRegion() : parent) || this;
        _this.name = name;
        _this.kind = kind;
        // if this is a starting state (initial, deep or shallow history), record it against the parent region
        if (_this.kind === index_1.PseudoStateKind.Initial || _this.isHistory()) {
            // TODO: FIX			assert.ok(this.parent!.starting, () => `Only one initial pseudo state is allowed in region ${this.parent}`);
            _this.parent.starting = _this;
        }
        _this.parent.children.unshift(_this);
        util_1.log.info(function () { return "Created " + _this.kind + " pseudo state " + _this; }, util_1.log.Create);
        return _this;
    }
    /**
     * Tests a pseudo state to see if is is a history pseudo state
     * @returns Returns true if the pseudo state is of the deep or shallow history kind
     */
    PseudoState.prototype.isHistory = function () {
        return this.kind === index_1.PseudoStateKind.DeepHistory || this.kind === index_1.PseudoStateKind.ShallowHistory;
    };
    /**
     * Creates a new transition with a type test.
     * @remarks Once creates with the [[Vertex.on]] method, the transition can be enhanced using the fluent API calls of [[Transition.if]], [[Transition.to]]/[[Transition.local]] and [[Transition.do]].
     * @param type The type of event that this transition will look for.
     * @returns Returns the newly created transition.
     * @public
     */
    PseudoState.prototype.on = function (type) {
        return new index_1.Transition(this, undefined, index_1.TransitionKind.internal, type);
    };
    PseudoState.prototype.when = function (guard) {
        return new index_1.Transition(this, undefined, index_1.TransitionKind.internal, undefined, guard);
    };
    /**
     * Creates a new transition with a target vertex.
     * @remarks Once creates with the [[Vertex.tn]] method, the transition can be enhanced using the fluent API calls of [[Transition.on]] [[Transition.if]], [[Transition.local]] and [[Transition.do]]. If an event test is needed, create the transition with the [[on]] method.
     * @param to The target vertex of the transition.
     * @returns Returns the newly created transition.
     * @public
     */
    PseudoState.prototype.to = function (target) {
        return new index_1.Transition(this, target, index_1.TransitionKind.external);
    };
    /**
     * Creates an else transition from Junction or Choice pseudo states.
     * @param to The target vertex of the transition.
     * @returns Returns the newly created transition.
     * @public
     */
    PseudoState.prototype["else"] = function (target) {
        var _this = this;
        util_1.assert.ok(this.kind === index_1.PseudoStateKind.Choice || this.kind === index_1.PseudoStateKind.Junction, function () { return "Else transitions are only valid at Choice and Junction pseudo states"; });
        util_1.assert.ok(!this.elseTransition, function () { return "Only 1 else transition allowed at " + _this; });
        return this.elseTransition = new index_1.Transition(this, target, index_1.TransitionKind.external, undefined, function () { return false; });
    };
    /** Find a transition from the pseudo state for a given trigger event */
    PseudoState.prototype.getTransition = function (trigger) {
        var _this = this;
        var result = (this.kind !== index_1.PseudoStateKind.Choice ? _super.prototype.getTransition.call(this, trigger) : this.getChoiceTransition(trigger)) || this.elseTransition;
        // validate we have something to return
        util_1.assert.ok(result, function () { return "Unable to find transition at " + _this + " for " + trigger; });
        return result;
    };
    PseudoState.prototype.getChoiceTransition = function (trigger) {
        var transitions = this.outgoing.filter(function (transition) { return transition.evaluate(trigger); });
        return transitions[util_1.random.get(transitions.length)];
    };
    /** Initiate pseudo state entry */
    PseudoState.prototype.enterHead = function (instance, deepHistory, trigger, nextElement) {
        var _this = this;
        util_1.log.info(function () { return instance + " enter " + _this; }, util_1.log.Entry);
        // update the current vertex of the parent region
        instance.setVertex(this);
    };
    /** Complete pseudo state entry */
    PseudoState.prototype.enterTail = function (instance, deepHistory, trigger) {
        // a pseudo state must always have a completion transition (junction pseudo state completion occurs within the traverse method above)
        if (this.kind !== index_1.PseudoStateKind.Junction) {
            this.accept(instance, deepHistory, trigger);
        }
    };
    /** Leave a pseudo state */
    PseudoState.prototype.leave = function (instance, deepHistory, trigger) {
        var _this = this;
        util_1.log.info(function () { return instance + " leave " + _this; }, util_1.log.Exit);
    };
    /**
     * Returns the fully qualified name of the pseudo state.
     * @public
     */
    PseudoState.prototype.toString = function () {
        return this.qualifiedName;
    };
    return PseudoState;
}(Vertex_1.Vertex));
exports.PseudoState = PseudoState;
