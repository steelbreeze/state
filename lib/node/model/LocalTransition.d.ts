import { State } from './State';
import { Transition } from './Transition';
import { PseudoState } from './PseudoState';
/**
 * A local transition is one where the target vertex is a child of source composite state; the source composite state is not exited when traversed.
 * @param TTrigger The type of the trigger event that may cause this transition to be traversed.
 * @public
 */
export declare class LocalTransition<TTrigger> extends Transition<TTrigger> {
    readonly source: State;
    /**
     * Creates a new instance of the LocalTransition class.
     * @param TTrigger The type of the trigger that will cause this transition to be traversed.
     * @param source The source state of the transition.
     * @param target The target state of the transition to traverse to.
     * @summary A local transition, when traversed will:
     * exit all elements from the state below the source;
     * perform the transition behaviour;
     * enter all elements from the state below the source to the target.
     * @public
     */
    constructor(source: State, target: State | PseudoState);
}
