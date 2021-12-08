import { Instance } from ".";

/** Prototype of a function taking a single argument of a specific type and returning anything. */
export type Behaviour<T> = (trigger: T, instance: Instance) => any;
