"use strict";
exports.__esModule = true;
var util_1 = require("../util");
var PseudoState_1 = require("./PseudoState");
/** Semantics of external transitions. */
var ExternalTransitionActivation = /** @class */ (function () {
    function ExternalTransitionActivation(source, target) {
        util_1.assert.ok(target, function () { return "An external transition must have a target defined"; });
        // determine the source and target vertex ancestries
        var sourceAncestors = util_1.tree.ancestors(source, function (element) { return element.parent; });
        var targetAncestors = util_1.tree.ancestors(target, function (element) { return element.parent; });
        // determine where to enter and exit from in the ancestries
        var from = util_1.tree.lca(sourceAncestors, targetAncestors) + 1; // NOTE: we enter/exit from the elements below the common ancestor
        var to = targetAncestors.length - (target instanceof PseudoState_1.PseudoState && target.isHistory() ? 1 : 0); // NOTE: if the target is a history pseudo state we just enter the parent region and it's history logic will come into play
        // initialise the base class with source, target and elements to exit and enter		
        this.toExit = sourceAncestors[from];
        this.toEnter = targetAncestors.slice(from, to).reverse();
    }
    ExternalTransitionActivation.prototype.toString = function () {
        return "external";
    };
    return ExternalTransitionActivation;
}());
exports.ExternalTransitionActivation = ExternalTransitionActivation;
