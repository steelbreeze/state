/**
 * Represents an element within a state machine model hierarchy.
 * The model hierarchy is an arbitrary tree structure representing composite state machines.
 */
export declare abstract class NamedElement {
    readonly name: string;
    /**
     * The fully qualified name of the element; a composition of the name of element and all its parent elements.
     */
    readonly qualifiedName: string;
    /**
     * Creates a new instance of an element.
     * @param name The name of the element.
     * @param parent The parent of this element.
     */
    protected constructor(name: string, parent: NamedElement | undefined);
    /**
     * Returns the element in string form; the fully qualified name of the element.
     */
    toString(): string;
}
