"use strict";
exports.__esModule = true;
var index_1 = require("./index");
/**
 * Semantics of external transitions. Derives elements to exit and enter in advance using the lowest common ancestor rule.
 * @hidden
 */
var ExternalTransitionActivation = /** @class */ (function () {
    /**
     * Creates a new instance of the ExternalTransitionActivation class.
     * @param source The source vertex of the external transition.
     * @param target The target vertex of the external transition.
     */
    function ExternalTransitionActivation(source, target) {
        // determine the source and target vertex ancestries
        var sourceAncestors = ancestors(source, function (element) { return element.parent; });
        var targetAncestors = ancestors(target, function (element) { return element.parent; });
        // determine where to enter and exit from in the ancestries
        var from = lca(sourceAncestors, targetAncestors) + 1; // NOTE: we enter/exit from the elements below the common ancestor
        var to = targetAncestors.length - (target instanceof index_1.PseudoState && target.isHistory() ? 1 : 0); // NOTE: if the target is a history pseudo state we just enter the parent region and it's history logic will come into play
        // initialise the base class with source, target and elements to exit and enter		
        this.toExit = sourceAncestors[from];
        this.toEnter = targetAncestors.slice(from, to).reverse();
    }
    ExternalTransitionActivation.prototype.exitSource = function (instance, deepHistory, trigger) {
        // exit the element below the common ancestor
        this.toExit.leave(instance, deepHistory, trigger);
    };
    ExternalTransitionActivation.prototype.enterTarget = function (instance, deepHistory, trigger) {
        // enter elements below the common ancestor to the target
        for (var i = this.toEnter.length; i--;) {
            this.toEnter[i].enterHead(instance, deepHistory, trigger, this.toEnter[i - 1]);
        }
        // cascade the entry action to any child elements of the target
        this.toEnter[0].enterTail(instance, deepHistory, trigger);
    };
    /**
     * Returns the type of the transtiion.
     */
    ExternalTransitionActivation.prototype.toString = function () {
        return "external";
    };
    return ExternalTransitionActivation;
}());
exports.ExternalTransitionActivation = ExternalTransitionActivation;
/**
 * Returns the ancesry of a node within a tree, from the root node to the provided node.
 * @param node The node to get the ancestry of.
 * @param getParent A function that will return the immediate parent of a node.
 * @returns Returns an array of nodes with the root node of the tree in element 0.
 * @internal
 */
function ancestors(node, getParent) {
    var result = [];
    while (node) {
        result.unshift(node);
        node = getParent(node);
    }
    return result;
}
/**
 * Returns the index of the lowest common ancestor of two ancestry arrays.
 * @param a The first anccesrty array.
 * @param b The second ancestry array.
 * @returns Returns the index of the lowest common ancestor.
 * @internal
 */
function lca(a, b) {
    var max = Math.min(a.length, b.length);
    var result = 0;
    while (result < max && a[result] === b[result]) {
        result++;
    }
    return result - (result !== max ? 1 : 2);
}
