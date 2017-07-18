/**
 * Default random number implementation.
 * @hidden
 */
export declare let random: (max: number) => number;
/**
 * Sets a custom random number generator for state.js.
 *
 * The default implementation uses [Math.floor(Math.random() * max)]{@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random}.
 * @param value The new method to generate random numbers.
 * @return Returns the previous random number generator in use.
 */
export declare function setRandom(value: (max: number) => number): (max: number) => number;
