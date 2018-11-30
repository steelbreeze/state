"use strict";
exports.__esModule = true;
/** Interface describing elements to leave and enter when traversing the transition; derived from the source and target using the TransitionType strategy. */
var TransitionPath = /** @class */ (function () {
    /**
     * Creates a new instance of the TransitionPath class.
     * @param leave The optional named element to leave when traversing a transition.
     * @param enter The optional set of elements to enter when traversing a transition.
     */
    function TransitionPath(leave, enter) {
        if (leave === void 0) { leave = undefined; }
        if (enter === void 0) { enter = undefined; }
        this.leave = leave;
        this.enter = enter;
    }
    return TransitionPath;
}());
exports.TransitionPath = TransitionPath;
