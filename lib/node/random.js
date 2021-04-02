"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.random = void 0;
/**
 * Module enabling fine grained control of random number generation used when selecting transitions from Choice Pseudo States.
 */
var random;
(function (random) {
    let method = (ceiling) => {
        return Math.floor(Math.random() * ceiling);
    };
    /**
     * Returns a random element from an array.
     * @param TSource The type of elements within the source array.
     * @param source The array to select a random element from.
     * @returns Returns a random element from the soucre.
     */
    function get(source) {
        return source[method(source.length)];
    }
    random.get = get;
    /**
     * Sets the method used to generate random numbers
     * @param generator A function that takes a ceiling and returns a random number between 0 and ceiling - 1
     */
    function set(generator) {
        const result = method;
        method = generator;
        return result;
    }
    random.set = set;
})(random = exports.random || (exports.random = {}));
