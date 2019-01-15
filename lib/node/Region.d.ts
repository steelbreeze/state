import { NamedElement } from './NamedElement';
import { State } from './State';
/**
 * A region is a container of vertices (states and pseudo states) in a state machine model.
 * @public
 */
export declare class Region implements NamedElement<State> {
    readonly name: string;
    readonly parent: State;
    /**
     * The fully qualified name of the region including its parent's qualified name.
     * @public
     */
    readonly qualifiedName: string;
    /**
     * Creates a new instance of the Region class.
     * @param name The name of the region.
     * @param parent The parent state of the region.
     * @public
     */
    constructor(name: string, parent: State);
    /**
     * Returns the fully qualified name of the region.
     * @public
     */
    toString(): string;
}
