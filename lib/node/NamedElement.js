"use strict";
exports.__esModule = true;
var util_1 = require("./util");
/**
 * A named element is a part of the state machine hierarchy.
 * @param TParent The type of the parent of the named element.
 */
var NamedElement = /** @class */ (function () {
    /**
     * Creates a new instance of the NamedElement class
     * @param name The name of the named element.
     * @param parent The parent element of the named element.
     */
    function NamedElement(name, parent) {
        var _this = this;
        this.name = name;
        this.parent = parent;
        this.qualifiedName = parent ? parent + "." + name : name;
        util_1.log.info(function () { return "Created " + _this; }, util_1.log.Create);
    }
    /**
     * Enter an element during state machine execution.
     * @param instance The state machine instance.
     * @param deepHistory True if deep history semantics are in force at the time of entry.
     * @param trigger The trigger event that caused the entry operation.
     * @internal
     */
    NamedElement.prototype.enter = function (instance, deepHistory, trigger) {
        this.enterHead(instance, deepHistory, trigger, undefined);
        this.enterTail(instance, deepHistory, trigger);
    };
    /**
     * Enter an element, without cascading the entry operation.
     * @param instance The state machine instance.
     * @param deepHistory True if deep history semantics are in force at the time of entry.
     * @param trigger The trigger event that caused the entry operation.
     * @param nextElement The next element to be entered after this one (used to assist regino entry)
     * @internal
     */
    NamedElement.prototype.enterHead = function (instance, deepHistory, trigger, nextElement) {
        var _this = this;
        util_1.log.info(function () { return instance + " enter " + _this; }, util_1.log.Entry);
    };
    /**
     * Leaves an element and cascades the leaver operation to child eleemtns as required
     * @param instance The state machine instance.
     * @param deepHistory True if deep history semantics are in force at the time of exiting the element.
     * @param trigger The trigger event that caused the entry operation.
     * @internal
     */
    NamedElement.prototype.leave = function (instance, deepHistory, trigger) {
        var _this = this;
        util_1.log.info(function () { return instance + " leave " + _this; }, util_1.log.Exit);
    };
    /**
     * Returns the fully qualified name of the named element.
     */
    NamedElement.prototype.toString = function () {
        return this.qualifiedName;
    };
    return NamedElement;
}());
exports.NamedElement = NamedElement;
