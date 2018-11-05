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
var PseudoState_1 = require("./PseudoState");
/**
 * A local transition is one where the target vertex is a child of source composite state; the source composite state is not exited when traversed.
 * @public
 */
var LocalTransition = /** @class */ (function (_super) {
    __extends(LocalTransition, _super);
    /**
     * Creates a new instance of the LocalTransition class.
     * @param TTrigger The type of the trigger that will cause this transition to be traversed.
     * @param source The source state of the transition.
     * @param target The target state of the transition to traverse to.
     * @summary A local transition, when traversed will:
     * exit all elements from the state below the source;
     * perform the transition behaviour;
     * enter all elements from the state below the source to the target.
     * @public
     */
    function LocalTransition(source, target) {
        var _this = _super.call(this, source, target) || this;
        _this.source = source;
        // determine the target ancestry
        var targetAncestors = util_1.tree.ancestors(target, function (element) { return element.parent; }); // NOTE: as the target is a child of the source it will be in the same ancestry
        // determine where to enter and exit from in the ancestry
        var from = targetAncestors.indexOf(source) + 2; // NOTE: in local transitions the source vertex is not exited, but the active child substate is
        var to = targetAncestors.length - (target instanceof PseudoState_1.PseudoState && target.isHistory() ? 1 : 0); // NOTE: if the target is a history pseudo state we just enter the parent region and it's history logic will come into play
        // initialise the base class with source, target and elements to exit and enter
        _this.toLeave = targetAncestors[from];
        _this.toEnter = targetAncestors.slice(from, to).reverse(); // NOTE: reversed as we use a reverse-for at runtime for performance
        util_1.log.info(function () { return "Created local transition from " + source + " to " + target; }, util_1.log.Create);
        return _this;
    }
    return LocalTransition;
}(Transition_1.Transition));
exports.LocalTransition = LocalTransition;
