import { func } from "./func";
/**
 * Controls the method used by @steelbreeze/state to create random numbers.
 */
export declare namespace random {
    /**
     * Returns a random number between 0 and max - 1
     * @param max The ceiling for the random number
     * @returns Returns a random number between 0 and max - 1
     */
    let get: func.Func<number, number>;
    /**
     * Overrides the default method of random number generation.
     * @param value The new function to use to generate random numbers
     * @returns Returns the old method used to generate random numbers
     */
    function set(value: func.Func<number, number>): func.Func<number, number>;
}
