/**
 * Used to differentiate the various kinds of pseudo state.
 */
export declare enum PseudoStateKind {
    /**
     * A dynamic conditional branch in compound transitions. The outbound transitions of the choice pseudo state will be evaluated after the transition in; therefore the side effects of any transition behaviour from the incoming transition will be visible to the guard conditions of the outgoing transitions.
     * @remarks If the guard conditions of more than one outbound transition evaluate true a random one will be selected.
     */
    Choice = 1,
    /**
     * The staring vertex when entering a region for the first time; subsiquent entry of region will use the last known active state in place of the deep history pseudo state. Likewise, for any child regions, the last known active state will be entered.
     */
    DeepHistory = 2,
    /**
     * The staring vertex when entering a region. There can be at most one transition from an initial pseudo state which will be traversed when the region is entered.
     */
    Initial = 4,
    /**
     * A static conditional branch in compound transitions. The outbound transitions of the junction pseudo state will be evaluated before the transition in; therefore the side effects of any transition behaviour from the incoming transition will not be visible to the guard conditions of the outgoing transitions.
     */
    Junction = 8,
    /**
     * The staring vertex when entering a region for the first time; subsiquent entry of region will use the last known active state in place of the deep history pseudo state.
     */
    ShallowHistory = 16,
    /**
     * The set of pseudo state kinds that are history pseudi state kinds.
     * @hidden
     */
    History = 18,
    /**
     * The set of pseudo state kinds that are starting pseudi state kinds.
     * @hidden
     */
    Starting = 22
}
