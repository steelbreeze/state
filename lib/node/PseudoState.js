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
var PseudoState = /** @class */ (function (_super) {
    __extends(PseudoState, _super);
    function PseudoState(name, parent, kind) {
        if (kind === void 0) { kind = _1.PseudoStateKind.Initial; }
        var _this = _super.call(this, name, parent instanceof _1.State ? parent.getDefaultRegion() : parent) || this;
        _this.kind = kind;
        _this.getTransition = _this.kind === _1.PseudoStateKind.Choice ? function (instance, trigger) { return random_1.random.get(_this.outgoing.filter(function (transition) { return transition.evaluate(trigger); })) || _this.elseTransition; } : function (instance, trigger) { return _super.prototype.getTransition.call(_this, instance, trigger) || _this.elseTransition; };
        if (_this.kind === _1.PseudoStateKind.Initial || _this.kind === _1.PseudoStateKind.DeepHistory || _this.kind === _1.PseudoStateKind.ShallowHistory) {
            _this.parent.initial = _this;
        }
        return _this;
    }
    PseudoState.prototype["else"] = function (target) {
        if (this.kind === _1.PseudoStateKind.Choice || this.kind === _1.PseudoStateKind.Junction) {
            this.elseTransition = new _1.Transition(this).to(target).when(function () { return false; });
        }
        else {
            throw new Error("Unable to create else transition from " + this);
        }
        return this.elseTransition;
    };
    PseudoState.prototype.isHistory = function () {
        return this.kind === _1.PseudoStateKind.DeepHistory || this.kind === _1.PseudoStateKind.ShallowHistory;
    };
    PseudoState.prototype.doEnterTail = function (instance, history, trigger) {
        if (this.kind !== _1.PseudoStateKind.Junction) {
            this.evaluate(instance, history, trigger);
        }
    };
    return PseudoState;
}(_1.Vertex));
exports.PseudoState = PseudoState;
