import * as model from '../model';
import { log } from '../util';
import { IInstance, evaluate } from '../runtime';

/**
 * Represents the active state configuration of a state machine instance.
 * @remarks This is the default implementation of the IInstance class and reads/writes to the active state configuration in a transactional manner at both initilisation and each call to evaluate.
 */
export class Instance implements IInstance {
	private cleanState: Record<string, model.State> = {};                      // NOTE: this is the persistent representation of state machine state
	private dirtyState: Record<string, model.State> = {};                      //       this is the state machine state with the transaction context and will update lastKnownState on commit
	private dirtyVertex: Record<string, model.State | model.PseudoState> = {}; //       this is transient within the transaction context and is discarded

	public constructor(private readonly name: string, public readonly root: model.State) {
		this.transaction(() => this.root.enter(this, false, undefined));
	}

	public evaluate(trigger: any): boolean {
		log.info(() => `${this} evaluate ${typeof trigger} trigger: ${trigger}`, log.Evaluate)
	
		return this.transaction(() => evaluate(this.root, this, false, trigger));
	}
	
	public transaction<TReturn>(operation: () => TReturn): TReturn {
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

	public setVertex(vertex: model.State | model.PseudoState): void {
		if (vertex.parent) {
			this.dirtyVertex[vertex.parent.qualifiedName] = vertex;
		}
	}

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

	public toString(): string {
		return this.name;
	}
}