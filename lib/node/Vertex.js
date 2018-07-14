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
var TransitionKind_1 = require("./TransitionKind");
var NamedElement_1 = require("./NamedElement");
var Region_1 = require("./Region");
var state_1 = require("./state");
/** The source or target of a [transition]{@link Transition} within a [state machine model]{@link StateMachine}. A vertex can be either a [[State]] or a [[PseudoState]]. */
var Vertex = /** @class */ (function (_super) {
    __extends(Vertex, _super);
    /** Creates a new instance of the [[Vertex]] class.
     * @param name The name of this [vertex]{@link Vertex}.
     * @param parent The parent [element]{@link IElement} of this [vertex]{@link Vertex}. If a [state]{@link State} or [state machine]{@link StateMachine} is specified, its [default region]{@link State.defaultRegion} used as the parent.
     */
    function Vertex(name, parent) {
        var _this = _super.call(this, name, parent instanceof Region_1.Region ? parent : parent.defaultRegion() || new Region_1.Region(Region_1.Region.defaultName, parent)) || this;
        /** The set of possible [transitions]{@link Transition} that this [vertex]{@link Vertex} can be the source of. */
        _this.outgoing = new Array();
        /** The set of possible [transitions]{@link Transition} that this [vertex]{@link Vertex} can be the target of. */
        _this.incoming = new Array();
        _this.parent.children.push(_this);
        return _this;
    }
    /** Creates a new [transition]{@link Transition} from this [vertex]{@link Vertex}.
     * @param target The [vertex]{@link Vertex} to [transition]{@link Transition} to. Leave this as undefined to create an [internal transition]{@link TransitionKind.Internal}.
     * @param kind The kind of the [transition]{@link Transition}; use this to explicitly set [local transition]{@link TransitionKind.Local} semantics as needed.
     */
    Vertex.prototype.to = function (target, kind) {
        if (kind === void 0) { kind = TransitionKind_1.TransitionKind.External; }
        return new state_1.Transition(this, target, kind);
    };
    return Vertex;
}(NamedElement_1.NamedElement));
exports.Vertex = Vertex;
