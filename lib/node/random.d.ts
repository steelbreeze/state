/**
 * Returns a random element from an array.
 * @param source The array to select a random element from.
 * @returns Returns a random element from the soucre.
 */
export declare function random<TSource>(source: Array<TSource>): TSource;
export declare namespace random {
    var set: (generator: (ceiling: number) => number) => (max: number) => number;
}
