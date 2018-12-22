"use strict";
exports.__esModule = true;
var util_1 = require("./util");
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
        var sourceAncestors = util_1.tree.ancestors(source, function (element) { return element.parent; });
        var targetAncestors = util_1.tree.ancestors(target, function (element) { return element.parent; });
        // determine where to enter and exit from in the ancestries
        var from = util_1.tree.lca(sourceAncestors, targetAncestors) + 1; // NOTE: we enter/exit from the elements below the common ancestor
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
 * Semantics of local transitions. The elements to exit and enter when traversing a local transition  depend on the active state configuration at the time of traversal.
 * @hidden
 */
var LocalTransitionActivation = /** @class */ (function () {
    /**
     * Creates a new instance of the LocalTransitionActivation class.
     * @param source The source vertex of the local transition.
     * @param target The target vertex of the local transition.
     */
    function LocalTransitionActivation(source, target) {
        this.target = target;
    }
    LocalTransitionActivation.prototype.exitSource = function (instance, deepHistory, trigger) {
        this.toEnter = this.target;
        // TODO: remove !'s
        // iterate towards the root until we find an active state
        while (this.toEnter.parent && !isActive(this.toEnter.parent.parent, instance)) {
            this.toEnter = this.toEnter.parent.parent;
        }
        // TODO: remove !'s
        // exit the currently active vertex in the target vertex's parent region
        if (!isActive(this.toEnter, instance) && this.toEnter.parent) {
            instance.getVertex(this.toEnter.parent).leave(instance, deepHistory, trigger);
        }
    };
    LocalTransitionActivation.prototype.enterTarget = function (instance, deepHistory, trigger) {
        if (this.toEnter && !isActive(this.toEnter, instance)) {
            this.toEnter.enter(instance, deepHistory, trigger);
        }
    };
    /**
     * Returns the type of the transtiion.
     */
    LocalTransitionActivation.prototype.toString = function () {
        return "local";
    };
    return LocalTransitionActivation;
}());
exports.LocalTransitionActivation = LocalTransitionActivation;
/**
 * Semantics of local transitions. Local transitions do not chance the active state configuration when traversed.
 * @hidden
 */
var InternalTransitionActivation = /** @class */ (function () {
    /**
     * Creates a new instance of the InternalTransitionActivation class.
     * @param source The source vertex of the internal transition.
     * @param target The target vertex of the internal transition.
     */
    function InternalTransitionActivation(source, target) {
        if (source instanceof index_1.State) {
            this.source = source;
        }
        else {
            throw new Error("Source of local transition must be a State.");
        }
    }
    InternalTransitionActivation.prototype.exitSource = function (instance, deepHistory, trigger) {
        // don't exit anything
    };
    InternalTransitionActivation.prototype.enterTarget = function (instance, deepHistory, trigger) {
        // test for completion transitions for internal transitions as there will be state entry/exit performed where the test is usually performed
        this.source.completion(instance, deepHistory, this.source);
    };
    /**
     * Returns the type of the transtiion.
     */
    InternalTransitionActivation.prototype.toString = function () {
        return "internal";
    };
    return InternalTransitionActivation;
}());
exports.InternalTransitionActivation = InternalTransitionActivation;
// TODO: move to Vertex class?
function isActive(vertex, instance) {
    return vertex.parent ? isActive(vertex.parent.parent, instance) && instance.getVertex(vertex.parent) === vertex : true;
}
