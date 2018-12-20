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
/** Interface describing elements to leave and enter when traversing the transition; derived from the source and target using the TransitionType strategy. */
var TransitionActivation = /** @class */ (function () {
    /**
     * Creates a new instance of the TransitionTransition activation class.
     * @param leave The optional named element to leave when traversing a transition.
     * @param enter The optional set of elements to enter when traversing a transition.
     */
    function TransitionActivation(kind, leave, enter) {
        if (leave === void 0) { leave = undefined; }
        if (enter === void 0) { enter = undefined; }
        this.kind = kind;
        this.leave = leave;
        this.enter = enter;
    }
    return TransitionActivation;
}());
exports.TransitionActivation = TransitionActivation;
var LocalTransitionActivation = /** @class */ (function (_super) {
    __extends(LocalTransitionActivation, _super);
    /**
     * Creates a new instance of the TransitionPath class.
     * @param leave The optional named element to leave when traversing a transition.
     * @param enter The optional set of elements to enter when traversing a transition.
     */
    function LocalTransitionActivation(kind, leave, enter) {
        if (leave === void 0) { leave = undefined; }
        if (enter === void 0) { enter = undefined; }
        return _super.call(this, kind, leave, enter) || this;
    }
    return LocalTransitionActivation;
}(TransitionActivation));
exports.LocalTransitionActivation = LocalTransitionActivation;
