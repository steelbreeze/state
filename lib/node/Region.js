"use strict";
exports.__esModule = true;
var util_1 = require("./util");
var PseudoStateKind_1 = require("./PseudoStateKind");
/**
 * A region is a container of vertices (states and pseudo states) in a state machine model.
 * @public
 */
var Region = /** @class */ (function () {
    /**
     * Creates a new instance of the Region class.
     * @param name The name of the region.
     * @param parent The parent state of the region.
     * @public
     */
    function Region(name, parent) {
        var _this = this;
        this.name = name;
        this.parent = parent;
        /**
         * The child vertices belonging to this region.
         * @internal
         */
        this.children = [];
        this.qualifiedName = parent + "." + name;
        this.parent.children.unshift(this);
        util_1.log.info(function () { return "Created region " + _this; }, util_1.log.Create);
    }
    /** Enter a region, state or pseudo state */
    Region.prototype.enter = function (instance, deepHistory, trigger) {
        this.enterHead(instance, deepHistory, trigger, undefined);
        this.enterTail(instance, deepHistory, trigger);
    };
    /** Initiate region entry */
    Region.prototype.enterHead = function (instance, deepHistory, trigger, nextElement) {
        var _this = this;
        util_1.log.info(function () { return instance + " enter " + _this; }, util_1.log.Entry);
    };
    /** Complete region entry */
    Region.prototype.enterTail = function (instance, deepHistory, trigger) {
        var _this = this;
        var current;
        var starting = this.starting;
        // determine if history semantics are in play and the region has previously been entered then select the starting vertex accordingly
        if ((deepHistory || (this.starting && this.starting.isHistory())) && (current = instance.getState(this))) {
            starting = current;
            deepHistory = deepHistory || (this.starting.kind === PseudoStateKind_1.PseudoStateKind.DeepHistory);
        }
        util_1.assert.ok(starting, function () { return instance + " no initial pseudo state found at " + _this; });
        // cascade the entry operation to the approriate child vertex
        starting.enter(instance, deepHistory, trigger);
    };
    /** Leave a region */
    Region.prototype.leave = function (instance, deepHistory, trigger) {
        var _this = this;
        // cascade the leave operation to the currently active child vertex
        instance.getVertex(this).leave(instance, deepHistory, trigger);
        util_1.log.info(function () { return instance + " leave " + _this; }, util_1.log.Exit);
    };
    /**
     * Returns the fully qualified name of the region.
     * @public
     */
    Region.prototype.toString = function () {
        return this.qualifiedName;
    };
    return Region;
}());
exports.Region = Region;
