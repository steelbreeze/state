/** Prototype for a random number generator function. Takes a maximum number and returns a value from 0 to max -1. */
export interface Random {
	(max: number): number;
}

/**
 * Default random number implementation.
 * @hidden
 */
export let random: Random = (max: number): number => Math.floor(Math.random() * max);

/**
 * Sets a custom random number generator for state.js.
 * 
 * The default implementation uses [Math.floor(Math.random() * max)]{@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random}.
 * @param value The new method to generate random numbers.
 * @return Returns the previous random number generator in use.
 */
export function setRandom(value: Random): Random {
	const result = random;

	random = value;

	return result;
}