/**
 * The pseudo state kind enumeration determines the behaviour and use of the pseudo state class.
 * @public
 */
export enum PseudoStateKind {
	/**
	 * An initial pseudo state is the starting vertex when entering its parent region.
	 * @public
	 */
	Initial = 1,

	/**
	 * A shallow history pseudo state is the starting vertex when entering its parent region for the first time;
	 *  on re-entry to the parent region the last known state of the region will be entered.
	 * @public
	 */
	ShallowHistory = 2,

	/**
	 * A deep history pseudo state is the starting vertex when entering its parent region for the first time;
	 *  on re-entry to the parent region the last known state of the region will be entered.
	 *  This re-entry behaviour cascades to all child state.
	 * @public
	 */
	DeepHistory = 4,

	/**
	 * A junction is a static conditional branch, allowing transitions to different target states based upon the trigger.
	 * As a static conditional branch, the outbound transition guard conditions are tested before the transition into the junction had been traversed.
	 * @public
	 */
	Junction = 8,

	/**
	 * A junction is a dynamic conditional branch, allowing transitions to different target states based upon the trigger.
	 * As a dynamic conditional branch, the outbound transition guard conditions are tested after the transition into the junction had been traversed.
	 * If multiple outbound transitions evaluate true, a random one is selected.
	 * @public
	 */
	Choice = 16
}

/**
 * Branch pseudo states are either junction or choice pseudo states.
 */
export const Branch: PseudoStateKind = PseudoStateKind.Junction | PseudoStateKind.Choice;

/**
 * History pseudo states are either deep history or shallow history pseudo states.
 */
export const History: PseudoStateKind = PseudoStateKind.DeepHistory | PseudoStateKind.ShallowHistory;

/**
 * Starting pseudo states are either initial, deep history or shallow history pseudo states.
 */
export const Starting: PseudoStateKind = PseudoStateKind.Initial | PseudoStateKind.DeepHistory | PseudoStateKind.ShallowHistory;