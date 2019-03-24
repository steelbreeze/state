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
    Region.prototype.isComplete = function (instance) {
        var currentState = instance.getState(this);
        return currentState && currentState.isFinal();
    };
    /**
     * Performs the final steps required to enter the region dueing state transition; enters the region using the initial pseudo state or history logic.
     * @param instance The state machine instance that is entering the element.
     * @param history Flag used to denote deep history semantics are in force at the time of entry.
     * @param trigger The event that triggered the state transition.
     * @internal
     * @hidden
     */
    Region.prototype.doEnterTail = function (instance, history, trigger) {
        var current;
        var starting = this.initial;
        if ((history || (this.initial && this.initial.isHistory())) && (current = instance.getState(this))) {
            starting = current;
            history = history || (this.initial.kind === _1.PseudoStateKind.DeepHistory);
        }
        if (starting) {
            starting.doEnter(instance, history, trigger);
        }
        else {
            throw new Error(instance + " unable to find initial or history vertex at " + this);
        }
    };
    /**
     * Exits a region during a state transition.
     * @param instance The state machine instance that is exiting the element.
     * @param history Flag used to denote deep history semantics are in force at the time of exit.
     * @param trigger The event that triggered the state transition.
     * @internal
     * @hidden
     */
    Region.prototype.doExit = function (instance, history, trigger) {
        instance.getVertex(this).doExit(instance, history, trigger);
        _super.prototype.doExit.call(this, instance, history, trigger);
    };
    return Region;
}(_1.NamedElement));
exports.Region = Region;
