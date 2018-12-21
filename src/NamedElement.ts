/**
 * A named element is a part of the state machine hierarchy.
 * @param TParent The type of the parent of the named element.
 */
export interface NamedElement<TParent = any> {
	/**
	 * The parent element of the named element.
	 */
	readonly parent: TParent;

	/**
	 * The name of the named element.
	 */
	readonly name: String;

	/**
	 * The fully qualified name of the named element, including parent names.
	 */
	readonly qualifiedName: string;

	
	/**
	 * Returns the fully qualified name of the state.
	 */
	toString(): string;
}