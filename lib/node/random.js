"use strict";
exports.__esModule = true;
/**
 * Default random number implementation.
 * @hidden
 */
exports.random = function (max) { return Math.floor(Math.random() * max); };
/**
 * Sets a custom random number generator for state.js.
 *
 * The default implementation uses [Math.floor(Math.random() * max)]{@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random}.
 * @param value The new method to generate random numbers.
 * @return Returns the previous random number generator in use.
 */
function setRandom(value) {
    var result = exports.random;
    exports.random = value;
    return result;
}
exports.setRandom = setRandom;
