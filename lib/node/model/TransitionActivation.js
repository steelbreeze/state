"use strict";
exports.__esModule = true;
var util_1 = require("../util");
var PseudoState_1 = require("./PseudoState");
var ExternalTransitionActivation = /** @class */ (function () {
    function ExternalTransitionActivation(transition) {
        // determine the source and target vertex ancestries
        var sourceAncestors = util_1.tree.ancestors(transition.source, function (element) { return element.parent; });
        var targetAncestors = util_1.tree.ancestors(transition.target, function (element) { return element.parent; });
        // determine where to enter and exit from in the ancestries
        var from = util_1.tree.lca(sourceAncestors, targetAncestors) + 1; // NOTE: we enter/exit from the elements below the common ancestor
        var to = targetAncestors.length - (transition.target instanceof PseudoState_1.PseudoState && transition.target.isHistory() ? 1 : 0); // NOTE: if the target is a history pseudo state we just enter the parent region and it's history logic will come into play
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
var LocalTransitionActivation = /** @class */ (function () {
    function LocalTransitionActivation(transition) {
        // TODO: assertions including source is state
        this.source = transition.source;
        // determine the target ancestry
        var targetAncestors = util_1.tree.ancestors(transition.target, function (element) { return element.parent; }); // NOTE: as the target is a child of the source it will be in the same ancestry
        // determine where to enter and exit from in the ancestry
        var from = targetAncestors.indexOf(transition.source) + 2; // NOTE: in local transitions the source vertex is not exited, but the active child substate is
        var to = targetAncestors.length - (transition.target instanceof PseudoState_1.PseudoState && transition.target.isHistory() ? 1 : 0); // NOTE: if the target is a history pseudo state we just enter the parent region and it's history logic will come into play
        // initialise the base class with source, target and elements to exit and enter
        this.toEnter = targetAncestors.slice(from, to).reverse();
    }
    LocalTransitionActivation.prototype.toString = function () {
        return "local";
    };
    return LocalTransitionActivation;
}());
exports.LocalTransitionActivation = LocalTransitionActivation;
var InternalTransitionActivation = /** @class */ (function () {
    function InternalTransitionActivation(transition) {
        // TODO: assertions including source is state
        this.source = transition.source;
    }
    InternalTransitionActivation.prototype.toString = function () {
        return "internal";
    };
    return InternalTransitionActivation;
}());
exports.InternalTransitionActivation = InternalTransitionActivation;
