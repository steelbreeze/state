/**
 * Generic types to simplify the specification of function prototypes used in callbacks.
 */
export declare namespace types {
    /** Prototype of a class constructor. */
    type Constructor<T> = new (...args: any[]) => T;
    /** Prototype of a function taking a single argument of a specific type and returning anything. */
    type Consumer<T> = (arg: T) => any;
    /** Prototype for any function taking a single parameter. */
    type Function<T, R> = (arg: T) => R;
    /** Prototype of a function taking a single argument of a specific type and returning a boolean result. */
    type Predicate<T> = (arg: T) => boolean;
    /** Prototype of a function taking no arguments and returning result of a specific type. */
    type Producer<T> = () => T;
}
