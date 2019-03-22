/**
 * Module enabling fine grained control of random number generation used when selecting transitions from Choice Pseudo States.
 */
export namespace random {
	let method = (ceiling: number): number => {
		return Math.floor(Math.random() * ceiling);
	}

	/**
	 * Returns a random element from an array.
	 * @param TSource The type of elements within the source array.
	 * @param source The array to select a random element from.
	 * @returns Returns a random element from the soucre.
	 */
	export function get<TSource>(source: Array<TSource>): TSource {
		return source[method(source.length)];
	}

	/**
	 * Sets the method used to generate random numbers
	 * @param generator A function that takes a ceiling and returns a random number between 0 and ceiling - 1
	 */
	export function set(generator: (ceiling: number) => number): (max: number) => number {
		const result = method;

		method = generator;

		return result;
	}
}
