import { Vertex } from './Vertex';
export declare class NewTransition<TTrigger> {
    readonly source: Vertex;
    private target;
    private typeTest;
    private guard;
    constructor(source: Vertex, type: (new (...args: any[]) => TTrigger) | undefined, guard: ((trigger: TTrigger) => boolean) | undefined, target: Vertex | undefined, local: boolean, action: ((trigger: TTrigger) => any) | undefined);
    on(type: new (...args: any[]) => TTrigger): this;
    if(guard: (trigger: TTrigger) => boolean): this;
    to(target: Vertex): this;
    local(): this;
    do(action: (trigger: TTrigger) => any): this;
    evaluate(trigger: TTrigger): boolean;
}
