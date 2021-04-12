"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.random = void 0;
/**
 * The method used for generating a random selection from an array of items.
 * @hidden
 */
let randomNumberGenerator = (ceiling) => {
    return Math.floor(Math.random() * ceiling);
};
/**
 * Returns a random element from an array.
 * @param TSource The type of elements within the source array.
 * @param source The array to select a random element from.
 * @returns Returns a random element from the soucre.
 */
function random(source) {
    return source[randomNumberGenerator(source.length)];
}
exports.random = random;
/**
 * Sets the method used to generate random numbers
 * @param generator A function that takes a ceiling and returns a random number between 0 and ceiling - 1
 */
random.set = function (generator) {
    const result = randomNumberGenerator;
    randomNumberGenerator = generator;
    return result;
};
