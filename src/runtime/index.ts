/**
 * The interface that state machine instances must conform to in order to be processed by the runtime.
 */
export { IInstance } from './IInstance';

/**
 * The default implementation of a state machine instance using associative arrays as the storage mechanism.
 */
export { Instance } from './Instance';

export { evaluate } from './core';
