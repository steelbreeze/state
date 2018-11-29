import { func } from "./func";

/**
 * Controls the method used by @steelbreeze/state to create random numbers.
 */
export namespace random {
	/**
	 * Returns a random number between 0 and max - 1
	 * @param max The ceiling for the random number
	 * @returns Returns a random number between 0 and max - 1
	 */
	export let get: func.Func<number, number> = max => Math.floor(Math.random() * max);

	/**
	 * Overrides the default method of random number generation.
	 * @param value The new function to use to generate random numbers
	 * @returns Returns the old method used to generate random numbers
	 */
	export function set(value: func.Func<number, number>): func.Func<number, number> {
		const previous = get;

		get = value;

		return previous;
	}
}