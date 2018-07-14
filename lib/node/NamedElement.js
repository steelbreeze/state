"use strict";
exports.__esModule = true;
/** Common base class for [regions]{@link Region} and [vertices]{@link Vertex} within a [state machine model]{@link StateMachine}.
 * @param TParent The type of the element's parent.
 */
var NamedElement = /** @class */ (function () {
    /** Creates a new instance of the [[NamedElement]] class.
     * @param name The name of this [element]{@link NamedElement}.
     * @param parent The parent [element]{@link IElement} of this [element]{@link NamedElement}.
     */
    function NamedElement(name, parent) {
        this.name = name;
        this.parent = parent;
        this.invalidate();
    }
    /** Invalidates a [state machine model]{@link StateMachine} causing it to require recompilation.
     * @hidden
     */
    NamedElement.prototype.invalidate = function () {
        this.parent.invalidate();
    };
    /** Returns the fully qualified name of the [element]{@link NamedElement}. */
    NamedElement.prototype.toString = function () {
        return this.parent.toString() + NamedElement.separator + this.name;
    };
    /** The string used to seperate elements of a namespace */
    NamedElement.separator = ".";
    return NamedElement;
}());
exports.NamedElement = NamedElement;
