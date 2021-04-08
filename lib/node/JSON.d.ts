import { State, Region, Instance, Visitor } from '.';
import { Function } from './types';
declare class JSONNode {
    readonly name: String;
    constructor(element: Region | State);
}
declare class JSONState extends JSONNode {
    deferredEventPool: Array<any> | undefined;
    readonly children: Array<JSONRegion>;
    constructor(state: State);
}
declare class JSONRegion extends JSONNode {
    readonly activeState: string | undefined;
    readonly children: Array<JSONState>;
    constructor(region: Region, activeState: string | undefined);
}
export declare class JSONSerializer extends Visitor {
    private readonly instance;
    private readonly deferedEventSerializer;
    root: JSONState | undefined;
    private stateMap;
    private regionMap;
    constructor(instance: Instance, deferedEventSerializer?: Function<any, any> | undefined);
    visitState(state: State): void;
    visitRegion(region: Region): void;
    toString(): string;
}
export {};
