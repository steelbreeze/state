/** @module state
 * 
 * A finite state machine library for TypeScript and JavaScript
 * 
 * @copyright (c) 2014-8 David Mesquita-Morris
 * 
 * Licensed under the MIT and GPL v3 licences
 */

// Export the public interfaces and functions from the helpers
export { Logger, setLogger } from './logger';
export { Random, setRandom } from './random';

// Export the core model enumerations and classes
export { PseudoStateKind } from './PseudoStateKind';
export { TransitionKind } from './TransitionKind';
export { Region } from './Region';
//export { PseudoState } from './PseudoState';
export { Visitor } from './Visitor';


export * from './state';