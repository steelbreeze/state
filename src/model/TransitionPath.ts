import { NamedElement } from './NamedElement';

/** Interface describing elements to leave and enter when traversing the transition; derived from the source and target using the TransitionType strategy. */
export interface TransitionPath {
	leave: NamedElement | undefined;
	enter: Array<NamedElement> | undefined;
}
