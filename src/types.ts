import { Instance } from "./Instance";

/** Prototype of a class constructor. */
export type Constructor<T> = new (...args: any[]) => T;

/** Prototype of a function taking a single argument of a specific type and returning anything. */
export type Behaviour<T> = (trigger: T, instance: Instance) => any;

/** Prototype for any function taking a single parameter. */
export type Function<T, R> = (arg: T) => R;

/** Prototype of a function taking a single argument of a specific type and returning a boolean result. */
export type Predicate<T> = Function<T, boolean>;

/** Prototype of a function taking a single argument of a specific type and returning anything. */
export type Consumer<T> = Function<T, any>;

/** Prototype of a function taking no arguments and returning result of a specific type. */
export type Producer<R> = () => R;
