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
var Region = /** @class */ (function (_super) {
    __extends(Region, _super);
    function Region(name, parent) {
        var _this = _super.call(this, name, parent) || this;
        _this.parent = parent;
        _this.children = [];
        parent.children.push(_this);
        return _this;
    }
    Region.prototype.getParent = function () {
        return this.parent;
    };
    Region.prototype.isComplete = function (instance) {
        var currentState = instance.getState(this);
        return currentState && currentState.isFinal();
    };
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
    Region.prototype.doExit = function (instance, history, trigger) {
        instance.getVertex(this).doExit(instance, history, trigger);
        _super.prototype.doExit.call(this, instance, history, trigger);
    };
    return Region;
}(_1.NamedElement));
exports.Region = Region;
