import { Transition } from './Transition';
import { State } from './State';
/**
 * An internal transition does not effect a state change when it is traversed, it only has transition behaviour.
 * @public
 */
export declare class InternalTransition<TTrigger> extends Transition<TTrigger> {
    readonly source: State;
    /**
     * Creates a new instance of the InternalTransition class.
     * @param TTrigger The type of the trigger that will cause this transition to be traversed.
     * @param state The state that the state machine must be in for this transition to be traversed.
     * @summary An internal transition, when traversed will:
     * perform the transition behaviour.
     * @public
     */
    constructor(source: State);
}
