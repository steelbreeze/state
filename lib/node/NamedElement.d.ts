import { IInstance } from './IInstance';
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
    private readonly qualifiedName;
    protected constructor(name: string, parent: TParent);
    enter(instance: IInstance, deepHistory: boolean, trigger: any): void;
    enterHead(instance: IInstance, deepHistory: boolean, trigger: any, nextElement: NamedElement | undefined): void;
    abstract enterTail(instance: IInstance, deepHistory: boolean, trigger: any): void;
    leave(instance: IInstance, deepHistory: boolean, trigger: any): void;
    /**
     * Returns the fully qualified name of the state.
     */
    toString(): string;
}
