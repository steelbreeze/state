import { NamedElement } from "./NamedElement";
import { Region } from './Region';
import { IInstance } from './IInstance';
/**
 * A vertex is an element that can be the source or target of a transition.
 */
export declare abstract class Vertex implements NamedElement<Region | undefined> {
    readonly name: string;
    readonly parent: Region | undefined;
    /**
     * The fully qualified name of the vertex including its parent's qualified name.
     * @public
     */
    readonly qualifiedName: string;
    protected constructor(name: string, parent: Region | undefined);
    isActive(instance: IInstance): boolean;
    enter(instance: IInstance, deepHistory: boolean, trigger: any): void;
    abstract enterHead(instance: IInstance, deepHistory: boolean, trigger: any, nextElement: NamedElement | undefined): void;
    abstract enterTail(instance: IInstance, deepHistory: boolean, trigger: any): void;
    abstract leave(instance: IInstance, deepHistory: boolean, trigger: any): void;
}
