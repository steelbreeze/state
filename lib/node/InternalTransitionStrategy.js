"use strict";
exports.__esModule = true;
var _1 = require(".");
/**
 * Logic used to traverse internal transitions.
 */
var InternalTransitionStrategy = /** @class */ (function () {
    function InternalTransitionStrategy(source, target) {
        this.target = target;
    }
    InternalTransitionStrategy.prototype.doEnterTarget = function (instance, history, trigger) {
        if (this.target instanceof _1.State) {
            this.target.completion(instance, history);
        }
    };
    InternalTransitionStrategy.prototype.doExitSource = function (instance, history, trigger) {
    };
    InternalTransitionStrategy.prototype.toString = function () {
        return "internal";
    };
    return InternalTransitionStrategy;
}());
exports.InternalTransitionStrategy = InternalTransitionStrategy;
