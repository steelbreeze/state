export namespace random {
	/**
	 * Returns a random number between 0 and max - 1
	 * @param max The ceiling for the random number
	 * @returns Returns a random number between 0 and max - 1
	 */
	export let get: (max: number) => number = (max: number) => Math.floor(Math.random() * max);

	/**
	 * Overrides the default method of random number generation.
	 * @param value The new function to use to generate random numbers
	 * @returns Returns the old method used to generate random numbers
	 */
	export function set(value: (max: number) => number): (max: number) => number {
		const previous = get;

		get = value;

		return previous;
	}
}