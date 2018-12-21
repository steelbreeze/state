"use strict";
exports.__esModule = true;
/**
 * A named element is a part of the state machine hierarchy.
 * @param TParent The type of the parent of the named element.
 */
var NamedElement = /** @class */ (function () {
    function NamedElement(name, parent) {
        this.name = name;
        this.parent = parent;
        this.qualifiedName = parent ? parent + "." + name : name;
    }
    NamedElement.prototype.enter = function (instance, deepHistory, trigger) {
        this.enterHead(instance, deepHistory, trigger, undefined);
        this.enterTail(instance, deepHistory, trigger);
    };
    /**
     * Returns the fully qualified name of the state.
     */
    NamedElement.prototype.toString = function () {
        return this.qualifiedName;
    };
    return NamedElement;
}());
exports.NamedElement = NamedElement;
