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
var random_1 = require("./random");
var _1 = require(".");
var TransitionKind_1 = require("./TransitionKind");
/**
 * A pseudo state is a transient state within a region, once entered it will exit immediately.
 */
var PseudoState = /** @class */ (function (_super) {
    __extends(PseudoState, _super);
    /**
     * Creates a new instance of the PseudoState class.
     * @param name The name of the pseudo state.
     * @param parent The parent region of the pseudo state; note that a state can also be used, in which case the default region of the state will become the pseudo states parent.
     * @param kind The kind pseudo state which defines its behaviour and use.
     */
    function PseudoState(name, parent, kind) {
        if (kind === void 0) { kind = _1.PseudoStateKind.Initial; }
        var _this = _super.call(this, name, parent instanceof _1.State ? parent.getDefaultRegion() : parent) || this;
        _this.kind = kind;
        _this.isHistory = _this.kind === _1.PseudoStateKind.DeepHistory || _this.kind === _1.PseudoStateKind.ShallowHistory;
        if (_this.kind === _1.PseudoStateKind.Initial || _this.isHistory) {
            _this.parent.initial = _this;
        }
        return _this;
    }
    /**
     * Creates an 'else' transition from this pseudo state, which will be chosen if no other outgoing transition is found.
     * @param target The target of the transition.
     * @param kind The kind of the transition, specifying its behaviour.
     * @returns Returns a new untyped transition.
     */
    PseudoState.prototype["else"] = function (target, kind) {
        if (kind === void 0) { kind = TransitionKind_1.TransitionKind.External; }
        return this.elseTransition = new _1.Transition(this).to(target, kind).when(function () { return false; });
    };
    /**
     * Tests a pseudo state to determine if it is a history pseudo state.
     * @returns Returns true if the pseudo state is a history pseudo state.
     * @internal
     * @hidden
     */
    //	isHistory(): boolean {
    //		return this.kind === PseudoStateKind.DeepHistory || this.kind === PseudoStateKind.ShallowHistory;
    //	}
    /**
     * Selects an outgoing transition from this pseudo state based on the trigger event.
     * @param instance The state machine instance.
     * @param trigger The trigger event.
     * @returns Returns a transition or undefined if none were found.
     * @internal
     * @hidden
     */
    PseudoState.prototype.getTransition = function (instance, trigger) {
        var transition = this.kind === _1.PseudoStateKind.Choice ? random_1.random.get(this.outgoing.filter(function (transition) { return transition.evaluate(trigger); })) : _super.prototype.getTransition.call(this, instance, trigger);
        return transition || this.elseTransition;
    };
    /**
     * Immediately exits the pseudo state on entry; note that for junction pseudo states, this is managed in Transition.traverse
     * @param instance The state machine instance that is entering the element.
     * @param history Flag used to denote deep history semantics are in force at the time of entry.
     * @param trigger The event that triggered the state transition.
     * @internal
     * @hidden
     */
    PseudoState.prototype.doEnterTail = function (instance, history, trigger) {
        if (this.kind !== _1.PseudoStateKind.Junction) {
            this.evaluate(instance, history, trigger);
        }
    };
    /**
     * Accepts a visitor and calls back its visitPseudoState method.
     * @param visitor The visitor to call back.
     */
    PseudoState.prototype.accept = function (visitor) {
        visitor.visitPseudoState(this);
        visitor.visitPseudoStateTail(this);
    };
    return PseudoState;
}(_1.Vertex));
exports.PseudoState = PseudoState;
