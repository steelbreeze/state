import { types, TransitionKind, Vertex, Instance } from '.';
export declare class Transition<TTrigger = any> {
    readonly source: Vertex;
    target: Vertex;
    private eventType;
    private guard;
    private traverseActions;
    private strategy;
    constructor(source: Vertex);
    on(eventType: types.Constructor<TTrigger>): this;
    when(guard: types.Predicate<TTrigger>): this;
    to(target: Vertex, kind?: TransitionKind): this;
    effect(...actions: Array<types.Consumer<TTrigger>>): this;
    evaluate(trigger: any): boolean;
    doTraverse(instance: Instance, history: boolean, trigger: any): void;
    execute(instance: Instance, history: boolean, trigger: any): void;
    toString(): string;
}
