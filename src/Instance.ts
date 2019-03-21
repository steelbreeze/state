import { log, Vertex, Region, State } from '.';


export class Instance {
	private cleanState: Record<string, State> = {};
	private dirtyState: Record<string, State> = {};
	private dirtyVertex: Record<string, Vertex> = {};
	private deferredEventPool: Array<any> = [];

	public constructor(public readonly name: string, public readonly root: State) {
		this.transaction(() => this.root.doEnter(this, false, this.root));
	}

	public evaluate(trigger: any): boolean {
		log.write(() => `${this} evaluate ${trigger}`, log.Evaluate);

		return this.transaction(() => {
			const result = this.root.evaluate(this, false, trigger);				// evaluate the trigger event

			if (result && this.deferredEventPool.length !== 0) {					// if there are deferred events, process them
				this.evaluateDeferred();

				this.deferredEventPool = this.deferredEventPool.filter(t => t);		// repack the deferred event pool
			}

			return result;
		});
	}

	transaction<TReturn>(operation: () => TReturn): TReturn {
		try {
			const result = operation();												// perform the transactional operation

			for (let keys = Object.keys(this.dirtyState), i = keys.length; i--;) {	// update the clean state
				this.cleanState[keys[i]] = this.dirtyState[keys[i]];
			}

			return result;															// return to the caller
		}

		finally {
			this.dirtyState = {};													// reset the dirty state
			this.dirtyVertex = {};
		}
	}

	defer(instance: Instance, trigger: any): void {
		log.write(() => `${instance} deferring ${trigger}`, log.Evaluate);

		this.deferredEventPool.unshift(trigger);
	}

	evaluateDeferred(): void {
		for (let i = this.deferredEventPool.length; i--;) {
			const trigger = this.deferredEventPool[i];

			if (trigger && this.root.getDeferred(this).indexOf(trigger.constructor) === -1) {
				delete this.deferredEventPool[i];

				log.write(() => `${this} evaluate deferred ${trigger}`, log.Evaluate)

				if (this.root.evaluate(this, false, trigger)) {
					this.evaluateDeferred();
					break;
				}
			}
		}
	}

	setVertex(vertex: Vertex): void {
		if (vertex.parent) {
			this.dirtyVertex[vertex.parent.toString()] = vertex;

			if (vertex instanceof State) {
				this.dirtyState[vertex.parent.toString()] = vertex;
			}
		}
	}

	getState(region: Region): State {
		return this.dirtyState[region.toString()] || this.cleanState[region.toString()];
	}

	getVertex(region: Region): Vertex {
		return this.dirtyVertex[region.toString()] || this.cleanState[region.toString()];
	}

	public getLastKnownState(region: Region): State | undefined {
		return this.cleanState[region.toString()];
	}

	public toString(): string {
		return this.name;
	}
}
