"use strict";
exports.__esModule = true;
var Transaction = /** @class */ (function () {
    function Transaction(instance) {
        this.instance = instance;
        this.dirtyState = {};
        this.dirtyVertex = {};
    }
    Transaction.prototype.setState = function (state) {
        if (state.parent) {
            this.dirtyState[state.parent.qualifiedName] = state;
        }
    };
    Transaction.prototype.getState = function (region) {
        return this.dirtyState[region.qualifiedName] || this.instance.getState(region);
    };
    Transaction.prototype.setVertex = function (vertex) {
        if (vertex.parent) {
            this.dirtyVertex[vertex.parent.qualifiedName] = vertex;
        }
    };
    Transaction.prototype.getVertex = function (region) {
        return this.dirtyVertex[region.qualifiedName] || this.instance.getState(region);
    };
    return Transaction;
}());
exports.Transaction = Transaction;
