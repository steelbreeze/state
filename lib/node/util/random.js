"use strict";
exports.__esModule = true;
var random;
(function (random) {
    random.get = function (max) { return Math.floor(Math.random() * max); };
    function set(value) {
        var previous = random.get;
        random.get = value;
        return previous;
    }
    random.set = set;
})(random = exports.random || (exports.random = {}));
