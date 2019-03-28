"use strict";
exports.__esModule = true;
/**
 * Logic used to traverse local transitions.
 */
var LocalTransitionStrategy = /** @class */ (function () {
    function LocalTransitionStrategy(source, target) {
        this.source = source;
        this.target = target;
    }
    LocalTransitionStrategy.prototype.doExitSource = function (instance, history, trigger) {
        this.vertexToEnter = this.target;
        while (this.vertexToEnter.parent && this.vertexToEnter.parent.parent && !this.vertexToEnter.parent.parent.isActive(instance)) {
            this.vertexToEnter = this.vertexToEnter.parent.parent;
        }
        if (!this.vertexToEnter.isActive(instance) && this.vertexToEnter.parent) {
            instance.getVertex(this.vertexToEnter.parent).doExit(instance, history, trigger);
        }
    };
    LocalTransitionStrategy.prototype.doEnterTarget = function (instance, history, trigger) {
        if (this.vertexToEnter && !this.vertexToEnter.isActive(instance)) {
            this.vertexToEnter.doEnter(instance, history, trigger);
        }
    };
    LocalTransitionStrategy.prototype.toString = function () {
        return "local";
    };
    return LocalTransitionStrategy;
}());
exports.LocalTransitionStrategy = LocalTransitionStrategy;
