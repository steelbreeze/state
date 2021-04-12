/**
 * Returns a random element from an array.
 * @param TSource The type of elements within the source array.
 * @param source The array to select a random element from.
 * @returns Returns a random element from the soucre.
 */
export declare function random<TSource>(source: Array<TSource>): TSource;
export declare namespace random {
    var set: (generator: (ceiling: number) => number) => (max: number) => number;
}
