import { types, NamedElement, Vertex, Region, Instance } from '.';
export declare class State extends Vertex {
    children: Array<Region>;
    private deferrableTrigger;
    private defaultRegion;
    private entryActions;
    private exitActions;
    constructor(name: string, parent?: State | Region | undefined);
    entry(...actions: Array<types.Consumer<any>>): this;
    exit(...actions: Array<types.Consumer<any>>): this;
    defer(...type: types.Constructor<any>[]): this;
    getDefaultRegion(): Region;
    isSimple(): boolean;
    isComposite(): boolean;
    isOrthogonal(): boolean;
    isFinal(): boolean;
    isComplete(instance: Instance): boolean;
    evaluate(instance: Instance, history: boolean, trigger: any): boolean;
    delegate(instance: Instance, history: boolean, trigger: any): boolean;
    doDefer(instance: Instance, trigger: any): boolean;
    getDeferred(instance: Instance): Array<types.Constructor<any>>;
    doEnterHead(instance: Instance, history: boolean, trigger: any, next: NamedElement | undefined): void;
    doEnterTail(instance: Instance, history: boolean, trigger: any): void;
    doExit(instance: Instance, history: boolean, trigger: any): void;
    completion(instance: Instance, history: boolean): void;
}
