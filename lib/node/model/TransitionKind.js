"use strict";
exports.__esModule = true;
var util_1 = require("../util");
var PseudoState_1 = require("./PseudoState");
/**
 * A transition's kind determines its traverasal behaviour.
 * @remarks These functions implement strategies in a variant of the strategy pattern that uses just functions instead of classes.
 */
var TransitionKind;
(function (TransitionKind) {
    /**
     * An external transition is the default transition kind between any two vertices (states or pseudo states).
     * Upon traversal it will: exit the source vertex and any parent elements (vertex or region) up to, but not including the common ancestor of the source and target;
     * it will then perform and user defined transition behaviour;
     * finally, it will enter the target vertex, having first entered any parent elements below the common ancestor as needed.
     * If the source or target vertices are not leaf-level elements within the state machine hierarchy, the exit or entry operation will cascate to child elements as needed.
     */
    function external(source, target) {
        // determine the source and target vertex ancestries
        var sourceAncestors = util_1.tree.ancestors(source, function (element) { return element.parent; });
        var targetAncestors = util_1.tree.ancestors(target, function (element) { return element.parent; });
        // determine where to enter and exit from in the ancestries
        var from = util_1.tree.lca(sourceAncestors, targetAncestors) + 1; // NOTE: we enter/exit from the elements below the common ancestor
        var to = targetAncestors.length - (target instanceof PseudoState_1.PseudoState && target.isHistory() ? 1 : 0); // NOTE: if the target is a history pseudo state we just enter the parent region and it's history logic will come into play
        // initialise the base class with source, target and elements to exit and enter		
        return { leave: sourceAncestors[from], enter: targetAncestors.slice(from, to).reverse() };
    }
    TransitionKind.external = external;
    /**
     * An internal transition does not cause a change of state; when traversed it only executes the user defined transition behaviour.
     */
    function internal(source, target) {
        return { leave: undefined, enter: [] };
    }
    TransitionKind.internal = internal;
    /**
     * A local transition is one where either the source or target is the common ancestor of both vertices.
     * Traversal is the same as an external transition but the common ancestor is not entered/exited.
     */
    function local(source, target) {
        // determine the target ancestry
        var targetAncestors = util_1.tree.ancestors(target, function (element) { return element.parent; }); // NOTE: as the target is a child of the source it will be in the same ancestry
        // test that the target is a child of the source
        util_1.assert.ok(targetAncestors.indexOf(source) !== -1, function () { return "Source vertex (" + source + ") must an ancestor of the target vertex (" + target + ")"; });
        // determine where to enter and exit from in the ancestry
        var from = targetAncestors.indexOf(source) + 2; // NOTE: in local transitions the source vertex is not exited, but the active child substate is
        var to = targetAncestors.length - (target instanceof PseudoState_1.PseudoState && target.isHistory() ? 1 : 0); // NOTE: if the target is a history pseudo state we just enter the parent region and it's history logic will come into play
        // initialise the base class with source, target and elements to exit and enter
        return { leave: targetAncestors[from], enter: targetAncestors.slice(from, to).reverse() };
    }
    TransitionKind.local = local;
})(TransitionKind = exports.TransitionKind || (exports.TransitionKind = {}));
