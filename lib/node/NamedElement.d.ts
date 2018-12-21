import { Instance } from './index';
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
    protected constructor(name: string, parent: TParent);
    enter(instance: Instance, deepHistory: boolean, trigger: any): void;
    abstract enterHead(instance: Instance, deepHistory: boolean, trigger: any, nextElement: NamedElement | undefined): void;
    abstract enterTail(instance: Instance, deepHistory: boolean, trigger: any): void;
    abstract leave(instance: Instance, deepHistory: boolean, trigger: any): void;
    /**
     * Returns the fully qualified name of the state.
     */
    toString(): string;
}
