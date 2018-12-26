/**
 * A named element is a part of the state machine hierarchy.
 * @param TParent The type of the parent of the named element.
 */
export declare abstract class NamedElement<TParent = any> {
    readonly name: string;
    readonly parent: TParent;
    /**
     * The fully qualified name of the named element, including parent names.
     */
    readonly qualifiedName: string;
    /**
     * Creates a new instance of the NamedElement class
     * @param name The name of the named element.
     * @param parent The parent element of the named element.
     */
    protected constructor(name: string, parent: TParent);
    /**
     * Returns the fully qualified name of the named element.
     */
    toString(): string;
}
