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
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
exports.__esModule = true;
var _1 = require(".");
/**
 * A region is a container of vertices (states and pseudo states) within a state machine model.
 */
var Region = /** @class */ (function (_super) {
    __extends(Region, _super);
    /**
     * Creates a new instance of the Region class.
     * @param name The name of the region.
     * @param parent The parent state of this region.
     */
    function Region(name, parent) {
        var _this = _super.call(this, name, parent) || this;
        _this.parent = parent;
        /**
         * The child  vertices of this region.
         * @internal
         * @hidden
         */
        _this.children = [];
        parent.children.push(_this);
        return _this;
    }
    /**
     * Returns the parent element of this region.
     * @returns Returns the parent element of this element.
     * @internal
     * @hidden
     */
    Region.prototype.getParent = function () {
        return this.parent;
    };
    /**
     * Tests a state machine instance to see if this region is complete within it.
     * A region is complete if it's current state is a final state (one with no outgoing transitions).
     * @internal
     * @hidden
     */
    Region.prototype.isComplete = function (transaction) {
        var currentState = transaction.getState(this);
        return currentState && currentState.isFinal();
    };
    /**
     * Performs the final steps required to enter the region dueing state transition; enters the region using the initial pseudo state or history logic.
     * @param transaction The current transaction being executed.
     * @param history Flag used to denote deep history semantics are in force at the time of entry.
     * @param trigger The event that triggered the state transition.
     * @internal
     * @hidden
     */
    Region.prototype.doEnterTail = function (transaction, history, trigger) {
        var current = transaction.getState(this);
        var starting = (history || (this.initial && this.initial.isHistory)) && current ? current : this.initial;
        var deepHistory = history || (this.initial !== undefined && this.initial.kind === _1.PseudoStateKind.DeepHistory);
        starting.doEnter(transaction, deepHistory, trigger);
    };
    /**
     * Exits a region during a state transition.
     * @param transaction The current transaction being executed.
     * @param history Flag used to denote deep history semantics are in force at the time of exit.
     * @param trigger The event that triggered the state transition.
     * @internal
     * @hidden
     */
    Region.prototype.doExit = function (transaction, history, trigger) {
        transaction.getVertex(this).doExit(transaction, history, trigger);
        _super.prototype.doExit.call(this, transaction, history, trigger);
    };
    /**
     * Accepts a visitor and calls back its visitRegion method and cascade to child vertices.
     * @param visitor The visitor to call back.
     */
    Region.prototype.accept = function (visitor) {
        var e_1, _a;
        visitor.visitRegion(this);
        try {
            for (var _b = __values(this.children), _c = _b.next(); !_c.done; _c = _b.next()) {
                var vertex = _c.value;
                vertex.accept(visitor);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        visitor.visitRegionTail(this);
    };
    return Region;
}(_1.NamedElement));
exports.Region = Region;
