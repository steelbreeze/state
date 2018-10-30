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
var util_1 = require("../util");
var Transition_1 = require("./Transition");
/**
 * An internal transition does not effect a state change when it is traversed, it only has transition behaviour.
 * @public
 */
var InternalTransition = /** @class */ (function (_super) {
    __extends(InternalTransition, _super);
    /**
     * Creates a new instance of the InternalTransition class.
     * @param TTrigger The type of the trigger that will cause this transition to be traversed.
     * @param state The state that the state machine must be in for this transition to be traversed.
     * @summary An internal transition, when traversed will:
     * perform the transition behaviour.
     * @public
     */
    function InternalTransition(source) {
        var _this = _super.call(this, source, source) || this;
        _this.source = source;
        util_1.log.info(function () { return "Created internal transition at " + _this.source; }, util_1.log.Create);
        return _this;
    }
    return InternalTransition;
}(Transition_1.Transition));
exports.InternalTransition = InternalTransition;
