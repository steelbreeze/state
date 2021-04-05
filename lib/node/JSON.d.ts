import { NamedElement, State, Region, Instance, Visitor } from '.';
import { types } from './types';
declare class JSONNode {
    readonly name: String;
    constructor(element: NamedElement);
}
declare class JSONState extends JSONNode {
    deferredEventPool: Array<any> | undefined;
    readonly children: Array<JSONRegion>;
}
declare class JSONRegion extends JSONNode {
    readonly activeState: string | undefined;
    readonly children: Array<JSONState>;
    constructor(region: NamedElement, activeState: string | undefined);
}
export declare class JSONSerializer extends Visitor {
    private readonly instance;
    private readonly deferedEventSerializer;
    root: JSONState | undefined;
    private stateMap;
    private regionMap;
    constructor(instance: Instance, deferedEventSerializer?: types.Function<any, any> | undefined);
    visitState(state: State): void;
    visitRegion(region: Region): void;
    toString(): string;
}
export {};
