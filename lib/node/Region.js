"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var util_1 = require("./util");
var NamedElement_1 = require("./NamedElement");
var PseudoStateKind_1 = require("./PseudoStateKind");
/**
 * A region is a container of vertices (states and pseudo states) in a state machine model.
 * @public
 */
var Region = /** @class */ (function (_super) {
    __extends(Region, _super);
    /**
     * Creates a new instance of the Region class.
     * @param name The name of the region.
     * @param parent The parent state of the region.
     * @public
     */
    function Region(name, parent) {
        var _this = _super.call(this, name, parent) || this;
        /**
         * The child vertices belonging to this region.
         * @internal
         */
        _this.children = [];
        _this.parent.children.unshift(_this);
        return _this;
    }
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
        // cascade the leave operation to the currently active child vertex
        instance.getVertex(this).leave(instance, deepHistory, trigger);
        _super.prototype.leave.call(this, instance, deepHistory, trigger);
    };
    return Region;
}(NamedElement_1.NamedElement));
exports.Region = Region;