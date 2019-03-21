import { NamedElement, Vertex, State, PseudoState, Instance } from '.';
export declare class Region extends NamedElement {
    readonly parent: State;
    children: Array<Vertex>;
    initial: PseudoState | undefined;
    constructor(name: string, parent: State);
    getParent(): NamedElement | undefined;
    isComplete(instance: Instance): boolean;
    doEnterTail(instance: Instance, history: boolean, trigger: any): void;
    doExit(instance: Instance, history: boolean, trigger: any): void;
}
