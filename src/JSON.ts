import { types, NamedElement, State, Region, Instance, Visitor } from '.';

class JSONNode {
	readonly name: String;

	public constructor(element: NamedElement) {
		this.name = element.name;
	}
}

class JSONState extends JSONNode {
	deferredEventPool: Array<any> | undefined;
	readonly children: Array<JSONRegion> = [];
}

class JSONRegion extends JSONNode {
	public readonly children: Array<JSONState> = [];

	constructor(region: Region, public readonly activeState: string | undefined) {
		super(region);
	}
}

export class JSONSerializer extends Visitor {
	public root: JSONState | undefined;

	private stateMap: Record<string, JSONState> = {};
	private regionMap: Record<string, JSONRegion> = {};

	public constructor(private readonly instance: Instance, private readonly deferedEventSerializer: types.Function<any, any> | undefined = undefined) {
		super();
	}

	visitStateHead(state: State) {
		const jsonState = new JSONState(state);

		this.stateMap[state.toString()] = jsonState;

		if (state.parent !== undefined) {
			this.regionMap[state.parent.toString()].children.push(jsonState);
		} else {
			this.root = jsonState;
		}
	}

	visitRegionHead(region: Region) {
		const lastKnownState = this.instance.getLastKnownState(region);
		const jsonRegion = new JSONRegion(region, lastKnownState ? lastKnownState.name : undefined);

		this.regionMap[region.toString()] = jsonRegion;

		this.stateMap[region.parent.toString()].children.push(jsonRegion);
	}


	public toString(): string {
		if (this.instance.deferredEventPool.length !== 0 && this.deferedEventSerializer && this.root) {
			this.root.deferredEventPool = this.instance.deferredEventPool.map(this.deferedEventSerializer);
		}

		return JSON.stringify(this.root);
	}
}
