"use strict";
exports.__esModule = true;
exports.InternalTransitionStrategy = void 0;
var _1 = require(".");
/**
 * Logic used to traverse internal transitions.
 */
var InternalTransitionStrategy = /** @class */ (function () {
    function InternalTransitionStrategy(source, target) {
        this.target = target;
    }
    InternalTransitionStrategy.prototype.doEnterTarget = function (transaction, history, trigger) {
        if (this.target instanceof _1.State) {
            this.target.completion(transaction, history);
        }
    };
    InternalTransitionStrategy.prototype.doExitSource = function (transaction, history, trigger) {
    };
    InternalTransitionStrategy.prototype.toString = function () {
        return "internal";
    };
    return InternalTransitionStrategy;
}());
exports.InternalTransitionStrategy = InternalTransitionStrategy;
