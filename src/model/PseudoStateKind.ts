/**
 * The PseudoStateKind enumeration determines the behaviour of PseudoState instances.
 * @public
 */
export enum PseudoStateKind {
	/**
	 * An Initial PseudoState is the starting PseudoState when entering its parent Region.
	 * @public
	 */
	Initial = 1,

	/**
	 * A ShallowHistory PseudoState is the starting PseudoState when entering its parent Region for the first time.
	 * On re-entry to the parent Region, the last known State of the Region will be used as the starting State.
	 * @public
	 */
	ShallowHistory = 2,

	/**
	 * A DeepHistory PseudoState is the starting PseudoState when entering its parent Region for the first time.
	 * On re-entry to the parent Region, the last known State of the Region will be used as the stating State.
	 * This re-entry behaviour cascades to all child Regions.
	 * @public
	 */
	DeepHistory = 4,

	/**
	 * A Junction PseudoState is a static conditional branch, allowing transitions to different target States or PseudoStates based upon the trigger event.
	 * As a static conditional branch, the outbound transition guard conditions are evaluated before the transition into the junction had been traversed and any incoming transition behaviour called.
	 * @public
	 */
	Junction = 8,

	/**
	 * A Choice PseudoState is a dynamic conditional branch, allowing transitions to different target States or PseudoStates based upon the trigger event.
	 * As a dynamic conditional branch, the outbound transition guard conditions are tested after the transition into the junction had been traversed and incoming transition behaviour called.
	 * If the guard conditions of multiple outbound transitions evaluate true, a random one is selected.
	 * @public
	 */
	Choice = 16
}
