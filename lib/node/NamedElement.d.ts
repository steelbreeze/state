import { IElement } from './IElement';
import { Visitor } from './Visitor';
/** Common base class for [regions]{@link Region} and [vertices]{@link Vertex} within a [state machine model]{@link StateMachine}.
 * @param TParent The type of the element's parent.
 */
export declare abstract class NamedElement<TParent extends IElement> implements IElement {
    readonly name: string;
    readonly parent: TParent;
    /** The string used to seperate elements of a namespace */
    static separator: string;
    /** Creates a new instance of the [[NamedElement]] class.
     * @param name The name of this [element]{@link NamedElement}.
     * @param parent The parent [element]{@link IElement} of this [element]{@link NamedElement}.
     */
    protected constructor(name: string, parent: TParent);
    /** Invalidates a [state machine model]{@link StateMachine} causing it to require recompilation.
     * @hidden
     */
    invalidate(): void;
    /** Accepts a [visitor]{@link Visitor} object.
     * @param visitor The [visitor]{@link Visitor} object.
     * @param args Any optional arguments to pass into the [visitor]{@link Visitor} object.
     */
    abstract accept(visitor: Visitor, ...args: any[]): any;
    /** Returns the fully qualified name of the [element]{@link NamedElement}. */
    toString(): string;
}
