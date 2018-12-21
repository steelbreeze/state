import { State, Instance } from './index';
import { NamedElement } from './NamedElement';
/**
 * A region is a container of vertices (states and pseudo states) in a state machine model.
 * @public
 */
export declare class Region extends NamedElement<State> {
    /**
     * Creates a new instance of the Region class.
     * @param name The name of the region.
     * @param parent The parent state of the region.
     * @public
     */
    constructor(name: string, parent: State);
    /** Initiate region entry */
    enterHead(instance: Instance, deepHistory: boolean, trigger: any, nextElement: NamedElement | undefined): void;
    /** Complete region entry */
    enterTail(instance: Instance, deepHistory: boolean, trigger: any): void;
    /** Leave a region */
    leave(instance: Instance, deepHistory: boolean, trigger: any): void;
    /**
     * Returns the fully qualified name of the region.
     * @public
     */
    toString(): string;
}
