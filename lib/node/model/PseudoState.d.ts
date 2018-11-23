import { Vertex } from './Vertex';
import { PseudoStateKind } from './PseudoStateKind';
import { Region } from './Region';
import { State } from './State';
import { Transition } from './Transition';
/**
 * A pseudo state is a transient elemement within a state machine, once entered it will evaluate outgoing transitions and attempt to exit.
 * @public
 */
export declare class PseudoState implements Vertex {
    readonly name: string;
    readonly kind: PseudoStateKind;
    readonly parent: Region;
    /**
     * The fully qualified name of the vertex including its parent's qualified name.
     * @public
     */
    readonly qualifiedName: string;
    /**
     * The outgoing transitions available from this vertex.
     */
    outgoing: Array<Transition>;
    /**
     * Creates a new instance of the PseudoState class.
     * @param name The name of the pseudo state.
     * @param parent The parent region of the pseudo state; a state may also be specified in which case the state's default region will be used as the parent region.
     * @param kind The kind of pseudo state; this defines its behaviour and use. See PseudoStateKind for more information.
     * @public
     */
    constructor(name: string, parent: State | Region, kind?: PseudoStateKind);
    /**
     * Tests a pseudo state to see if is is a history pseudo state
     * @returns Returns true if the pseudo state is of the deep or shallow history kind
     */
    isHistory(): boolean;
    on<TTrigger>(type: new (...args: any[]) => TTrigger): Transition<TTrigger>;
    to<TTrigger>(target: Vertex): Transition<TTrigger>;
    external<TTrigger>(target: Vertex): Transition<TTrigger>;
    else<TTrigger>(target: Vertex): Transition<TTrigger>;
    /**
     * Returns the fully qualified name of the pseudo state.
     * @public
     */
    toString(): string;
}
