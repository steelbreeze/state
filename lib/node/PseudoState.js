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
var Vertex_1 = require("./Vertex");
var PseudoStateKind_1 = require("./PseudoStateKind");
var State_1 = require("./State");
var Transition_1 = require("./Transition");
var TransitionKind_1 = require("./TransitionKind");
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
        if (kind === void 0) { kind = PseudoStateKind_1.PseudoStateKind.Initial; }
        var _this = _super.call(this, name, parent instanceof State_1.State ? parent.getDefaultRegion() : parent) || this;
        _this.kind = kind;
        // TODO: remove the !'s below
        //		this.parent = parent instanceof State ? parent.getDefaultRegion() : parent;
        //		this.qualifiedName = `${this.parent}.${this.name}`;
        // if this is a starting state (initial, deep or shallow history), record it against the parent region
        if (_this.kind === PseudoStateKind_1.PseudoStateKind.Initial || _this.isHistory()) {
            util_1.assert.ok(!_this.parent.starting, function () { return "Only one initial pseudo state is allowed in region " + _this.parent; });
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
        return this.kind === PseudoStateKind_1.PseudoStateKind.DeepHistory || this.kind === PseudoStateKind_1.PseudoStateKind.ShallowHistory;
    };
    /**
     * Creates a new transition with a type test.
     * @remarks Once creates with the [[Vertex.on]] method, the transition can be enhanced using the fluent API calls of [[Transition.if]], [[Transition.to]]/[[Transition.local]] and [[Transition.do]].
     * @param type The type of event that this transition will look for.
     * @returns Returns the newly created transition.
     * @public
     */
    PseudoState.prototype.on = function (type) {
        return new Transition_1.Transition(this, undefined, TransitionKind_1.TransitionKind.internal, type);
    };
    /**
     * Creates a new transition with a guard condition.
     * @param guard
     */
    PseudoState.prototype.when = function (guard) {
        return new Transition_1.Transition(this, undefined, TransitionKind_1.TransitionKind.internal, undefined, guard);
    };
    /**
     * Creates a new transition with a target vertex.
     * @remarks Once creates with the [[Vertex.tn]] method, the transition can be enhanced using the fluent API calls of [[Transition.on]] [[Transition.if]], [[Transition.local]] and [[Transition.do]]. If an event test is needed, create the transition with the [[on]] method.
     * @param to The target vertex of the transition.
     * @returns Returns the newly created transition.
     * @public
     */
    PseudoState.prototype.to = function (target) {
        return new Transition_1.Transition(this, target);
    };
    /**
     * A pseudonym for [[PseudoState.to]] provided for backwards compatability.
     * @param to The target vertex of the transition.
     * @returns Returns the newly created transition.
     * @public
     * @deprecated Use [[PseudoState.to]]. This method will be removed in the v8.0 release.
     */
    PseudoState.prototype.external = function (target) {
        return this.to(target);
    };
    /**
     * Creates an else transition from Junction or Choice pseudo states.
     * @param to The target vertex of the transition.
     * @returns Returns the newly created transition.
     * @public
     */
    PseudoState.prototype["else"] = function (target) {
        var _this = this;
        util_1.assert.ok(this.kind === PseudoStateKind_1.PseudoStateKind.Choice || this.kind === PseudoStateKind_1.PseudoStateKind.Junction, function () { return "Else transitions are only valid at Choice and Junction pseudo states"; });
        util_1.assert.ok(!this.elseTransition, function () { return "Only 1 else transition allowed at " + _this; });
        return this.elseTransition = new Transition_1.Transition(this, target, TransitionKind_1.TransitionKind.external, undefined, function () { return false; });
    };
    /**
     * Returns the transition to take given a trigger event.
     * @param trigger The trigger event.
     * @returns Returns the transition to take in response to the trigger.
     * @throws Throws an Error if the state machine model is ill defined.
     * @internal
     */
    PseudoState.prototype.getTransition = function (trigger) {
        var result = this.kind === PseudoStateKind_1.PseudoStateKind.Choice ? this.getChoiceTransition(trigger) : this.getOtherTransition(trigger);
        if (!result) {
            throw new Error("No outgoing transition found at " + this);
        }
        return result;
    };
    /**
     * Returns the transition to take given a trigger event at choice pseudo states.
     * @param trigger The trigger event.
     * @returns Returns the transition to take in response to the trigger.
     * @internal
     */
    PseudoState.prototype.getChoiceTransition = function (trigger) {
        var results = [];
        for (var i = this.outgoing.length; i--;) {
            if (this.outgoing[i].evaluate(trigger)) {
                results.push(this.outgoing[i]);
            }
        }
        return results[util_1.random.get(results.length)] || this.elseTransition;
    };
    /**
     * Returns the transition to take given a trigger event at non-choice pseudo ststes.
     * @param trigger The trigger event.
     * @returns Returns the transition to take in response to the trigger.
     * @internal
     */
    PseudoState.prototype.getOtherTransition = function (trigger) {
        var result;
        for (var i = this.outgoing.length; i--;) {
            if (this.outgoing[i].evaluate(trigger)) {
                result = this.outgoing[i];
            }
        }
        return result || this.elseTransition;
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
