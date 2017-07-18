/**
 * Default random number implementation.
 * @hidden
 */
export let random = (max: number) => Math.floor(Math.random() * max);

/**
 * Sets a custom random number generator for state.js.
 * 
 * The default implementation uses [Math.floor(Math.random() * max)]{@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random}.
 * @param value The new method to generate random numbers.
 * @return Returns the previous random number generator in use.
 */
export function setRandom(value: (max: number) => number): (max: number) => number {
	const result = random;

	random = value;

	return result;
}
