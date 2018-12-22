import { Instance } from './index';

/**
 * Encapsulates the semantics of different transition types.
 * @hidden
 */
export interface TransitionActivation {
	exitSource(instance: Instance, deepHistory: boolean, trigger: any): void;
	enterTarget(instance: Instance, deepHistory: boolean, trigger: any): void;

	toString(): string;
}
