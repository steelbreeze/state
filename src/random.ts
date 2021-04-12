/**
 * The method used for generating a random selection from an array of items.
 * @hidden 
 */
let randomNumberGenerator = (ceiling: number): number => {
	return Math.floor(Math.random() * ceiling);
}

/**
 * Returns a random element from an array.
 * @param TSource The type of elements within the source array.
 * @param source The array to select a random element from.
 * @returns Returns a random element from the soucre.
 */
export function random<TSource>(source: Array<TSource>): TSource {
	return source[randomNumberGenerator(source.length)];
}

/**
 * Sets the method used to generate random numbers
 * @param generator A function that takes a ceiling and returns a random number between 0 and ceiling - 1
 */
random.set = function(generator: (ceiling: number) => number): (max: number) => number {
	const result = randomNumberGenerator;

	randomNumberGenerator = generator;

	return result;
}
