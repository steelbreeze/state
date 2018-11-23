"use strict";
exports.__esModule = true;
var util_1 = require("../util");
var PseudoStateKind_1 = require("./PseudoStateKind");
var State_1 = require("./State");
var Transition_1 = require("./Transition");
/**
 * A pseudo state is a transient elemement within a state machine, once entered it will evaluate outgoing transitions and attempt to exit.
 * @public
 */
var PseudoState = /** @class */ (function () {
    /**
     * Creates a new instance of the PseudoState class.
     * @param name The name of the pseudo state.
     * @param parent The parent region of the pseudo state; a state may also be specified in which case the state's default region will be used as the parent region.
     * @param kind The kind of pseudo state; this defines its behaviour and use. See PseudoStateKind for more information.
     * @public
     */
    function PseudoState(name, parent, kind) {
        if (kind === void 0) { kind = PseudoStateKind_1.PseudoStateKind.Initial; }
        var _this = this;
        this.name = name;
        this.kind = kind;
        /**
         * The outgoing transitions available from this vertex.
         */
        this.outgoing = [];
        this.parent = parent instanceof State_1.State ? parent.getDefaultRegion() : parent;
        this.qualifiedName = this.parent + "." + this.name;
        // if this is a starting state (initial, deep or shallow history), record it against the parent region
        if (this.kind === PseudoStateKind_1.PseudoStateKind.Initial || this.isHistory()) {
            util_1.assert.ok(!this.parent.starting, function () { return "Only one initial pseudo state is allowed in region " + _this.parent; });
            this.parent.starting = this;
        }
        this.parent.children.unshift(this);
        util_1.log.info(function () { return "Created " + _this; }, util_1.log.Create);
    }
    /**
     * Tests a pseudo state to see if is is a history pseudo state
     * @returns Returns true if the pseudo state is of the deep or shallow history kind
     */
    PseudoState.prototype.isHistory = function () {
        return this.kind === PseudoStateKind_1.PseudoStateKind.DeepHistory || this.kind === PseudoStateKind_1.PseudoStateKind.ShallowHistory;
    };
    PseudoState.prototype.on = function (type) {
        return new Transition_1.Transition(this, type, undefined, undefined, false, undefined);
    };
    PseudoState.prototype.to = function (target) {
        return new Transition_1.Transition(this, undefined, undefined, target, false, undefined);
    };
    PseudoState.prototype.external = function (target) {
        return this.to(target);
    };
    PseudoState.prototype["else"] = function (target) {
        var _this = this;
        util_1.assert.ok(!this.elseTransition, function () { return "Only 1 else transition allowed at " + _this + "."; });
        return this.elseTransition = new Transition_1.Transition(this, undefined, function () { return false; }, target, false, undefined);
    };
    /**
     * Returns the fully qualified name of the pseudo state.
     * @public
     */
    PseudoState.prototype.toString = function () {
        return this.qualifiedName;
    };
    return PseudoState;
}());
exports.PseudoState = PseudoState;
