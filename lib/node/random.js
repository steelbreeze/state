"use strict";
exports.__esModule = true;
var method = function (ceiling) {
    return Math.floor(Math.random() * ceiling);
};
/**
 * Returns a random element from an array.
 * @param source The array to select a random element from.
 * @returns Returns a random element from the soucre.
 */
function random(source) {
    return source[method(source.length)];
}
exports.random = random;
/**
 * Sets the method used to generate random numbers
 * @param generator A function that takes a ceiling and returns a random number between 0 and ceiling - 1
 */
random.set = function (generator) {
    var result = method;
    method = generator;
    return result;
};
