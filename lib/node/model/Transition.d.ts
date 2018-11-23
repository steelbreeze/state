import { Vertex } from './Vertex';
/**
 * A transition between vertices.
 * @param TTrigger The type of triggering event that causes this transition to be traversed.
 */
export declare class Transition<TTrigger = any> {
    readonly source: Vertex;
    target: Vertex | undefined;
    private typeTest;
    private guard;
    /**
     * Creates an instance of the Transition class.
     * @param source The source [[Vertex]] of the transition.
     * @param type The type of triggering event that causes this transition to be traversed.
     * @param guard An optional guard condition to further restrict the transition traversal.
     * @param target The optional target of this transition. If not specified, the transition is an internal transition.
     * @param local A flag denoting that the transition is a local transition.
     * @param action An optional action to perform when traversing the transition.
     */
    constructor(source: Vertex, type: (new (...args: any[]) => TTrigger) | undefined, guard: ((trigger: TTrigger) => boolean) | undefined, target: Vertex | undefined, local: boolean, action: ((trigger: TTrigger) => any) | undefined);
    on(type: new (...args: any[]) => TTrigger): this;
    if(guard: (trigger: TTrigger) => boolean): this;
    when(guard: (trigger: TTrigger) => boolean): this;
    to(target: Vertex): this;
    local(): this;
    do(action: (trigger: TTrigger) => any): this;
    /**
     * Adds behaviour to the transition to be called every time the transition is traversed.
     * @param action The behaviour to call on transition traversal.
     * @returns Returns the transition.
     * @public
     * @deprecated Use Transition.do instead.
     */
    effect(action: (trigger: TTrigger) => void): this;
    evaluate(trigger: TTrigger): boolean;
}
