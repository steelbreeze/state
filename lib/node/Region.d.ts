import { NamedElement, State } from '.';
/**
 * A region is a container of vertices (states and pseudo states) within a state machine model.
 */
export declare class Region extends NamedElement {
    readonly parent: State;
    /**
     * Creates a new instance of the Region class.
     * @param name The name of the region.
     * @param parent The parent state of this region.
     */
    constructor(name: string, parent: State);
}
