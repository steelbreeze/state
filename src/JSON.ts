import { NamedElement, State, Region, Instance, Visitor } from '.';
import { types } from './types';

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

	constructor(region: NamedElement, public readonly activeState: string | undefined) {
		super(region);
	}
}

export class JSONSerializer extends Visitor {
	public root: JSONState | undefined;

	private stateMap: Map<NamedElement, JSONState> = new Map<NamedElement, JSONState>();
	private regionMap: Map<NamedElement, JSONRegion> = new Map<NamedElement, JSONRegion>();

	public constructor(private readonly instance: Instance, private readonly deferedEventSerializer: types.Function<any, any> | undefined = undefined) {
		super();
	}

	visitState(state: State) {
		const jsonState = new JSONState(state);

		this.stateMap.set(state, jsonState);

		if (state.parent !== undefined) {
			const parent = this.regionMap.get(state.parent);

			if (parent) {
				parent.children.push(jsonState);
			}
		} else {
			this.root = jsonState;
		}
	}

	visitRegion(region: Region) {
		const lastKnownState = this.instance.getState(region);
		const jsonRegion = new JSONRegion(region, lastKnownState ? lastKnownState.name : undefined);

		this.regionMap.set(region, jsonRegion);

		const parent = this.stateMap.get(region.parent);

		if (parent) {
			parent.children.push(jsonRegion);
		}
	}


	public toString(): string {
		if (this.instance.deferredEventPool.length !== 0 && this.deferedEventSerializer && this.root) {
			this.root.deferredEventPool = this.instance.deferredEventPool.map(this.deferedEventSerializer);
		}

		return JSON.stringify(this.root);
	}
}
