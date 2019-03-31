import { types, log, Vertex, Region, State } from '.';

/**
 * Represents an instance of a state machine model at runtime; there can be many seperate state machine instances using a common model.
 */
export class Instance {
	/** The stable active state configuration of the state machine. */
	private cleanState: Record<string, State> = {};

	/** The changes made to the active state configuration during transaction execution. */
	private dirtyState: Record<string, State> = {};

	/** The the last known active vertex during transaction execution. */
	private dirtyVertex: Record<string, Vertex> = {};

	/** The deferred triggers awaiting evaluation once the current active state configuration changes. */
	private deferredEventPool: Array<any> = [];

	/**
	 * Creates a new state machine instance conforming to a particular state machine model.
	 * @param name The name of the state machine instance.
	 * @param root The root state of the state machine instance.
	 */
	public constructor(public readonly name: string, public readonly root: State) {
		this.transaction(() => this.root.doEnter(this, false, this.root));			// enter the root element
	}

	/**
	 * Evaluates a trigger event to see if it causes a state transition.
	 * @param trigger The trigger event to evaluate.
	 * @returns Returns true if the trigger event caused a change in the active state configuration or was deferred.
	 */
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

	/**
	 * Performs an operation that may alter the active state configuration with a transaction.
	 * @param operation The operation to perform within a transaction.
	 */
	private transaction<TReturn>(operation: types.Producer<TReturn>): TReturn {
		try {
			const result = operation();												// perform the transactional operation
			const keys = Object.keys(this.dirtyState);

			for (let i = 0, l = keys.length; i < l; ++i) {							// update the active state configuration
				this.cleanState[keys[i]] = this.dirtyState[keys[i]];
			}

			return result;
		}

		finally {
			this.dirtyState = {};													// reset the dirty state
			this.dirtyVertex = {};
		}
	}

	/**
	 * Add a trigger event to the deferred event pool.
	 * @param trigger The trigger event to add to the deferred event pool.
	 * @internal
	 * @hidden
	 */
	defer(trigger: any): void {
		log.write(() => `${this} deferring ${trigger}`, log.Evaluate);

		this.deferredEventPool.push(trigger);
	}

	/**
	 * Evaluates trigger events in the deferred event pool.
	 */
	private evaluateDeferred(): void {
		for (let i = 0, l = this.deferredEventPool.length; i < l; ++i) {
			const trigger = this.deferredEventPool[i];

			if (trigger && this.root.getDeferrableTriggers(this).indexOf(trigger.constructor) === -1) { // TODO: revalidate logic
				delete this.deferredEventPool[i];

				log.write(() => `${this} evaluate deferred ${trigger}`, log.Evaluate)

				if (this.root.evaluate(this, false, trigger)) {
					this.evaluateDeferred();

					break;
				}
			}
		}
	}

	/**
	 * Updates the transactional state on a change in the active vertex winth a region.
	 * @param vertex The vertex to set as the currently active vertex for a region.
	 * @internal
	 * @hidden
	 */
	setVertex(vertex: Vertex): void {
		if (vertex.parent) {
			const region: Region = vertex.parent;

			this.dirtyVertex[region.toString()] = vertex;

			if (vertex instanceof State) {
				this.dirtyState[region.toString()] = vertex;
			}
		}
	}

	/**
	 * Retrieves the last known state for a region while in a transaction.
	 * @param region The region to return the last know state of.
	 * @returns Returns the last knows state or undefined if the region has not been entered.
	 * @internal
	 * @hidden
	 */
	getState(region: Region): State {
		return this.dirtyState[region.toString()] || this.cleanState[region.toString()];
	}

	/**
	 * Retrieves the last known vertex for a region while in a transaction.
	 * @param region The region to return the last know vertex of.
	 * @returns Returns the last knows vertex or undefined if the region has not been entered.
	 * @remarks This differs slightly from getState in that the last know vertex could be a pseudo state.
	 * @internal
	 * @hidden
	 */
	getVertex(region: Region): Vertex {
		return this.dirtyVertex[region.toString()] || this.cleanState[region.toString()];
	}

	/**
	 * Returns the last known state of a region from the stable active state configuration.
	 * @param region The region to find the last know state of.
	 * @returns Returns the last known state of the region or undefined if the region has not been entered.
	 */
	public getLastKnownState(region: Region): State | undefined {
		return this.cleanState[region.toString()];
	}

	/**
	 * Returns the name of the state machine instance.
	 * @returns Returns the name of the state machine instance.
	 */
	public toString(): string {
		return this.name;
	}
}
