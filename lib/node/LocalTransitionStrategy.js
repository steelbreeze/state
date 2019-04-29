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
    LocalTransitionStrategy.prototype.doExitSource = function (transaction, history, trigger) {
        this.vertexToEnter = this.target;
        while (this.vertexToEnter.parent && this.vertexToEnter.parent.parent && !this.vertexToEnter.parent.parent.isActive(transaction)) {
            this.vertexToEnter = this.vertexToEnter.parent.parent;
        }
        if (!this.vertexToEnter.isActive(transaction) && this.vertexToEnter.parent) {
            transaction.getVertex(this.vertexToEnter.parent).doExit(transaction, history, trigger);
        }
    };
    LocalTransitionStrategy.prototype.doEnterTarget = function (transaction, history, trigger) {
        if (this.vertexToEnter && !this.vertexToEnter.isActive(transaction)) {
            this.vertexToEnter.doEnter(transaction, history, trigger);
        }
    };
    LocalTransitionStrategy.prototype.toString = function () {
        return "local";
    };
    return LocalTransitionStrategy;
}());
exports.LocalTransitionStrategy = LocalTransitionStrategy;
