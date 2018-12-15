import { NamedElement } from './NamedElement';
import { TransitionKind } from './TransitionKind';

/** Interface describing elements to leave and enter when traversing the transition; derived from the source and target using the TransitionType strategy. */
export class TransitionPath {
	/**
	 * Creates a new instance of the TransitionPath class.
	 * @param leave The optional named element to leave when traversing a transition.
	 * @param enter The optional set of elements to enter when traversing a transition.
	 */
	constructor(public readonly kind: TransitionKind, public readonly leave: NamedElement | undefined = undefined, public readonly enter: Array<NamedElement> | undefined = undefined) { }
}
