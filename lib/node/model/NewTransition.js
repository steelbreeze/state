"use strict";
exports.__esModule = true;
var NewTransition = /** @class */ (function () {
    function NewTransition(source, type, guard, target, local, action) {
        this.source = source;
        this.typeTest = function () { return true; };
        this.guard = function () { return true; };
        if (type)
            this.on(type);
        if (guard)
            this["if"](guard);
        if (target)
            this.to(target);
        if (local)
            this.local();
        if (action)
            this["do"](action);
    }
    NewTransition.prototype.on = function (type) {
        this.typeTest = function (trigger) { return trigger.constructor === type; };
        return this;
    };
    NewTransition.prototype["if"] = function (guard) {
        this.guard = guard;
        return this;
    };
    NewTransition.prototype.to = function (target) {
        this.target = target;
        return this;
    };
    NewTransition.prototype.local = function () {
        return this;
    };
    NewTransition.prototype["do"] = function (action) {
        return this;
    };
    NewTransition.prototype.evaluate = function (trigger) {
        return this.typeTest(trigger) && this.guard(trigger);
    };
    return NewTransition;
}());
exports.NewTransition = NewTransition;
