"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var NamedElement_1 = require("./NamedElement");
/** A region is an orthogonal part of either a [composite state]{@link State} or a [state machine]{@link StateMachine}. It is container of [vertices]{@link Vertex} and has no behavior associated with it. */
var Region = /** @class */ (function (_super) {
    __extends(Region, _super);
    /** Creates a new instance of the [[Region]] class.
     * @param name The name of this [element]{@link NamedElement}.
     * @param parent The parent [element]{@link IElement} of this [element]{@link NamedElement}.
     */
    function Region(name, parent) {
        var _this = _super.call(this, name, parent) || this;
        /** The child [vertices]{@link Vertex} of this [region]{@link Region}. */
        _this.children = new Array();
        _this.parent.children.push(_this);
        return _this;
    }
    /** Tests a given [state machine instance]{@link IInstance} to see if this [region]{@link Region} is active. A [region]{@link Region} is active when it has been entered but not exited.
     * @param instance The [state machine instance]{@link IInstance} to test if this [region]{@link Region} is active within.
     * @return Returns true if the [region]{@link Region} is active.
     */
    Region.prototype.isActive = function (instance) {
        return this.parent.isActive(instance);
    };
    /** Tests a given [state machine instance]{@link IInstance} to see if this [region]{@link Region} is complete. A [region]{@link Region} is complete when it's current active [state]{@link State} is a [final state]{@link State.isFinal} (one that has no outbound [transitions]{@link Transition}.
     * @param instance The [state machine instance]{@link IInstance} to test if this [region]{@link Region} is complete within.
     * @return Returns true if the [region]{@link Region} is complete.
     */
    Region.prototype.isComplete = function (instance) {
        var currentState = instance.getLastKnownState(this);
        return currentState !== undefined && currentState.isFinal();
    };
    /** Accepts a [visitor]{@link Visitor} object.
     * @param visitor The [visitor]{@link Visitor} object.
     * @param args Any optional arguments to pass into the [visitor]{@link Visitor} object.
     */
    Region.prototype.accept = function (visitor) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return visitor.visitRegion.apply(visitor, [this].concat(args));
    };
    /** The default name of regions that are dynamically created. */
    Region.defaultName = "default";
    return Region;
}(NamedElement_1.NamedElement));
exports.Region = Region;
