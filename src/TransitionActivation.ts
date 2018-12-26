import { Instance } from './index';

/**
 * Encapsulates the semantics of different transition types.
 */
export interface TransitionActivation {
	/**
	 * Exits the source of the transition
	 * @param instance The state machine instance.
	 * @param deepHistory True if deep history semantics are in force at the time of exit.
	 * @param trigger The trigger event that caused the exit operation.
	 */
	exitSource(instance: Instance, deepHistory: boolean, trigger: any): void;

	/**
	 * Exits the target of the transition
	 * @param instance The state machine instance.
	 * @param deepHistory True if deep history semantics are in force at the time of entry.
	 * @param trigger The trigger event that caused the exit operation.
	 */
	enterTarget(instance: Instance, deepHistory: boolean, trigger: any): void;

	toString(): string;
}