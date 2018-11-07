import * as model from '../model';
import { assert, log } from '../util';
import { IInstance, evaluate } from '../runtime';

/**
 * Represents the active state configuration of a state machine instance.
 * @remarks This is the default implementation of the IInstance class and reads/writes to the active state configuration in a transactional manner at both initilisation and each call to evaluate.
 */
export class Instance implements IInstance {
	private cleanState: Record<string, model.State> = {};                      // NOTE: this is the persistent representation of state machine state
	private dirtyState: Record<string, model.State> = {};                      //       this is the state machine state with the transaction context and will update lastKnownState on commit
	private dirtyVertex: Record<string, model.State | model.PseudoState> = {}; //       this is transient within the transaction context and is discarded

	/**
	 * Creates an instance of the Instance class.
	 * @param name The name of the state machine instance.
	 * @param root The root element of the state machine model that this an instance of.
	 */
	public constructor(private readonly name: string, public readonly root: model.State, json: any = undefined) {
		if (json) {
			this.transaction(() => this.stateFromJSON(this.root, json));
		} else {
			this.transaction(() => this.root.enter(this, false, undefined));
		}
	}

	stateFromJSON(state: model.State, json: any): void {
		for (const jsonRegion of json.children) {
			for (const region of state.children) {
				if (region.name === jsonRegion.name) {
					this.regionFromJSON(region, jsonRegion);
				}
			}
		}
	}

	regionFromJSON(region: model.Region, json: any): void {
		for (const jsonState of json.children) {
			for (const state of region.children) {
				if (state.name === jsonState.name) {
					this.stateFromJSON(state as model.State, jsonState);
				}

				if(state.name === json.lastKnownState) {
					this.setState(state as model.State);
				}
			}
		}
	}

	/**
	 * Passes a trigger event to the state machine instance for evaluation.
	 * @param trigger The trigger event to evaluate.
	 * @returns Returns true if the trigger event caused a state transition.
	 */
	public evaluate(trigger: any): boolean {
		log.info(() => `${this} evaluate ${typeof trigger} trigger: ${trigger}`, log.Evaluate)

		return this.transaction(() => evaluate(this.root, this, false, trigger));
	}

	/**
	 * Performs an operation within a transactional context.
	 * @param TReturn The type of the return parameter of the transactional operation.
	 * @param operation The operation to perform within the transactional context.
	 * @returns Returns the return value from the transactional context.
	 */
	transaction<TReturn>(operation: () => TReturn): TReturn {
		// clear the transaction cache
		this.dirtyState = {};
		this.dirtyVertex = {};

		// perform the operation
		const result = operation();

		// commit the transaction cache to the clean state
		for (let k = Object.keys(this.dirtyState), i = k.length; i--;) {
			this.cleanState[k[i]] = this.dirtyState[k[i]];
		}

		// return the result to the caller
		return result;
	}

	/**
	 * Updates the transactional state of a region with the last entered vertex.
	 * @param vertex The vertex set as its parents last entered vertex.
	 * @remarks This should only be called by the state machine runtime.
	 */
	public setVertex(vertex: model.State | model.PseudoState): void {
		if (vertex.parent) {
			this.dirtyVertex[vertex.parent.qualifiedName] = vertex;
		}
	}

	/**
	 * Updates the transactional state of a region with the last entered state.
	 * @param state The state set as its parents last entered state.
	 * @remarks This should only be called by the state machine runtime, and implementors note, you also need to update the last entered vertex within this call.
	 */
	public setState(state: model.State): void {
		if (state.parent) {
			this.dirtyVertex[state.parent.qualifiedName] = state;
			this.dirtyState[state.parent.qualifiedName] = state;
		}
	}

	/**
	 * Returns the last known state of a given region. This is the call for the state machine runtime to use as it returns the dirty transactional state.
	 * @param region The region to get the last known state of.
	 * @returns Returns the last known region of the given state. If the state has not been entered this will return undefined.
	 */
	public getState(region: model.Region): model.State {
		return this.dirtyState[region.qualifiedName] || this.cleanState[region.qualifiedName];
	}

	/**
	 * Returns the last entered vertex to the state machine runtime.
	 * @param region The region to get the last entered vertex of.
	 * @returns Returns the last entered vertex for the given region.
	 */
	public getVertex(region: model.Region): model.State | model.PseudoState {
		return this.dirtyVertex[region.qualifiedName] || this.cleanState[region.qualifiedName];
	}

	/**
	 * Returns the last known state of a given region. This is the call for application programmers to use as it returns the clean transactional state more efficently.
	 * @param region The region to get the last known state of.
	 * @returns Returns the last known region of the given state. If the state has not been entered this will return undefined.
	 */
	public getLastKnownState(region: model.Region): model.State | undefined {
		return this.cleanState[region.qualifiedName];
	}

	public toJSON(): any {
		return this.stateToJSON(this.root);
	}

	stateToJSON(state: model.State): any {
		return { name: state.name, children: state.children.map(region => this.regionToJSON(region)) };
	}

	regionToJSON(region: model.Region): any {
		let lastKnownState = this.getLastKnownState(region);
		let states = region.children.filter((value): value is model.State => value instanceof model.State).reverse();

		return { name: region.name, children: states.map(state => this.stateToJSON(state)), lastKnownState: lastKnownState ? lastKnownState.name : undefined };
	}

	/**
	 * Returns the name of the state machine instance.
	 * @returns The name of the state machine instance.
	 */
	public toString(): string {
		return this.name;
	}
}