"use strict";
exports.__esModule = true;
var _1 = require(".");
var ExternalTransitionStrategy = /** @class */ (function () {
    function ExternalTransitionStrategy(source, target) {
        var sourceAncestors = source.getAncestors();
        var targetAncestors = target.getAncestors();
        var prevSource = sourceAncestors.next();
        var prevTarget = targetAncestors.next();
        var nextSource = sourceAncestors.next();
        var nextTarget = targetAncestors.next();
        while (prevSource.value === prevTarget.value && !nextSource.done && !nextTarget.done) {
            prevSource = nextSource;
            prevTarget = nextTarget;
            nextSource = sourceAncestors.next();
            nextTarget = targetAncestors.next();
        }
        this.toExit = prevSource.value;
        this.toEnter = [prevTarget.value];
        while (!nextTarget.done) {
            this.toEnter.push(nextTarget.value);
            nextTarget = targetAncestors.next();
        }
        if (target instanceof _1.PseudoState && target.isHistory()) {
            this.toEnter.pop();
        }
    }
    ExternalTransitionStrategy.prototype.doExitSource = function (instance, history, trigger) {
        this.toExit.doExit(instance, history, trigger);
    };
    ExternalTransitionStrategy.prototype.doEnterTarget = function (instance, history, trigger) {
        var _this = this;
        this.toEnter.forEach(function (element, index) { return element.doEnterHead(instance, history, trigger, _this.toEnter[index + 1]); });
        this.toEnter[this.toEnter.length - 1].doEnterTail(instance, history, trigger);
    };
    return ExternalTransitionStrategy;
}());
exports.ExternalTransitionStrategy = ExternalTransitionStrategy;
