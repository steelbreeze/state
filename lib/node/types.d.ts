import { Instance } from "./Instance";
/** Prototype of a function taking no arguments and returning result of a specific type. */
export declare type Producer<R> = () => R;
/** Prototype for any function taking a single parameter. */
export declare type Function<T, R> = (arg: T) => R;
/** Prototype of a function taking a single argument of a specific type and returning anything. */
export declare type Behaviour<T> = (arg: T, instance: Instance) => any;
/** Prototype of a function taking a single argument of a specific type and returning a boolean result. */
export declare type Predicate<T> = Function<T, boolean>;
/** Prototype of a function taking a single argument of a specific type and returning anything. */
export declare type Consumer<T> = Function<T, any>;
