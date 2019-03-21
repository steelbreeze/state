import { TransitionKind, Vertex, Instance } from '.';
export declare class Transition<TTrigger = any> {
    readonly source: Vertex;
    target: Vertex;
    private eventType;
    private guard;
    private traverseActions;
    private strategy;
    constructor(source: Vertex);
    on(eventType: new (...args: any[]) => TTrigger): this;
    when(guard: (trigger: TTrigger) => boolean): this;
    to(target: Vertex, kind?: TransitionKind): this;
    effect(...actions: Array<(trigger: TTrigger) => any>): this;
    evaluate(trigger: any): boolean;
    doTraverse(instance: Instance, history: boolean, trigger: any): void;
    execute(instance: Instance, history: boolean, trigger: any): void;
    toString(): string;
}
