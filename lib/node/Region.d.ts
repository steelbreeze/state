import { PseudoStateKind, State, Visitor } from '.';
/**
 * A region is a container of vertices (states and pseudo states) within a state machine model.
 */
export declare class Region {
    readonly name: string;
    readonly parent: State;
    /**
     * Creates a new instance of the Region class.
     * @param name The name of the region.
     * @param parent The parent state of this region.
     */
    constructor(name: string, parent: State);
    /**
     * Determines if the region has a particular history semantic.
     * @hidden
     */
    is(kind: PseudoStateKind): boolean;
    /**
     * Accepts a visitor and calls back its visitRegion method and cascade to child vertices.
     * @param visitor The visitor to call back.
     */
    accept(visitor: Visitor): void;
    /**
     * Returns the element in string form; the fully qualified name of the element.
     */
    toString(): string;
}
