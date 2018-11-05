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
var PseudoState_1 = require("./PseudoState");
var Transition_1 = require("./Transition");
/**
 * An external transition is the default transition type within a state machine, enabling transitions between any pair of vertices.
 * @public
 */
var ExternalTransition = /** @class */ (function (_super) {
    __extends(ExternalTransition, _super);
    /**
     * Creates a new instance of the ExternalTransition class.
     * @param TTrigger The type of the trigger that will cause this transition to be traversed.
     * @param source The source vertex to exit when the transition fires.
     * @param target The target vertex to enter when the transition fires.
     * @summary An external transition, when traversed will:
     * exit all elements from the element below the common ancestor of the source and target to the source;
     * perform the transition behaviour;
     * enter all elements from the element below the common ancestor of the source and target to the target.
     * @public
     */
    function ExternalTransition(source, target) {
        var _this = _super.call(this, source, target) || this;
        _this.source = source;
        // determine the source and target vertex ancestries
        var sourceAncestors = util_1.tree.ancestors(source, function (element) { return element.parent; });
        var targetAncestors = util_1.tree.ancestors(target, function (element) { return element.parent; });
        // determine where to enter and exit from in the ancestries
        var from = util_1.tree.lca(sourceAncestors, targetAncestors) + 1; // NOTE: we enter/exit from the elements below the common ancestor
        var to = targetAncestors.length - (target instanceof PseudoState_1.PseudoState && target.isHistory() ? 1 : 0); // NOTE: if the target is a history pseudo state we just enter the parent region and it's history logic will come into play
        // initialise the base class with source, target and elements to exit and enter		
        _this.toLeave = sourceAncestors[from];
        _this.toEnter = targetAncestors.slice(from, to).reverse(); // NOTE: reversed as we use a reverse-for at runtime for performance
        util_1.log.info(function () { return "Created external transition from " + source + " to " + target; }, util_1.log.Create);
        return _this;
    }
    return ExternalTransition;
}(Transition_1.Transition));
exports.ExternalTransition = ExternalTransition;
