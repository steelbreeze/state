import { PseudoStateKind, Vertex, Region, State, Transition, Instance } from '.';
export declare class PseudoState extends Vertex {
    readonly kind: PseudoStateKind;
    private elseTransition;
    constructor(name: string, parent: State | Region, kind?: PseudoStateKind);
    else(target: Vertex): Transition<any>;
    isHistory(): boolean;
    doEnterTail(instance: Instance, history: boolean, trigger: any): void;
}
