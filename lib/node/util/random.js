"use strict";
exports.__esModule = true;
var random;
(function (random) {
    /**
     * Returns a random number between 0 and max - 1
     * @param max The ceiling for the random number
     * @returns Returns a random number between 0 and max - 1
     */
    random.get = function (max) { return Math.floor(Math.random() * max); };
    /**
     * Overrides the default method of random number generation.
     * @param value The new function to use to generate random numbers
     * @returns Returns the old method used to generate random numbers
     */
    function set(value) {
        var previous = random.get;
        random.get = value;
        return previous;
    }
    random.set = set;
})(random = exports.random || (exports.random = {}));
