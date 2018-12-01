import { func, assert, log } from '../util';
import { Vertex } from './Vertex';
import { Region } from './Region';
import { Transition } from './Transition';
import { TransitionKind } from './TransitionKind';

/**
 * A state represents a condition in a state machine that is the result of the triggers processed.
 * @public
 */
export class State implements Vertex {
	public readonly parent: Region | undefined;
	/**
	 * The fully qualified name of the vertex including its parent's qualified name.
	 * @public
	 */
	public readonly qualifiedName: string;

	/**
	 * The outgoing transitions available from this vertex.
	 */
	public outgoing: Array<Transition> = [];

	/**
	 * The child regions belonging to this state.
	 * @internal
	 */
	children: Array<Region> = [];

	/**
	 * The default region used when creating state machine models with implicit regions.
	 * @internal
	 */
	defaultRegion: Region | undefined;

	/**
	 * The behaviour to each time the state is entered.
	 * @internal
	 */
	private onEnter: Array<func.Consumer<any>> = [];

	/**
	 * The behaviour to perform each time the is state exited.
	 * @internal
	 */
	private onLeave: Array<func.Consumer<any>> = [];

	/**
	 * The list of types that this state can defer to the event pool.
	 * @internal
	 */
	deferrableTrigger: Array<func.Constructor<any>> = [];

	/**
	 * Creates a new instance of the State class.
	 * @param name The name of the state.
	 * @param parent The parent region of the state or a state whose default region will be used as the parent region.
	 * If left undefined, this state is the root state in a state machine model.
	 * @public
	 */
	public constructor(public readonly name: string, parent: State | Region | undefined = undefined) {
		this.parent = parent instanceof State ? parent.getDefaultRegion() : parent;

		if (this.parent) {
			assert.ok(!this.parent.children.filter((vertex): vertex is State => vertex instanceof State && vertex.name === this.name).length, () => `State names must be unique within a region`);
			this.qualifiedName = `${this.parent}.${name}`;
			this.parent.children.unshift(this);
		} else {
			this.qualifiedName = name;
		}

		log.info(() => `Created ${this}`, log.Create);

	}

	/**
	 * Returns the default state of the region; creates one if it does not already exist.
	 * @returns Returns the default region.
	 * @public
	 */
	public getDefaultRegion(): Region {
		return this.defaultRegion || (this.defaultRegion = new Region(this.name, this));
	}

	/**
	 * Tests the state to see if it is a simple state (having no child regions).
	 * @returns True if the state has no child regions.
	 * @public
	 */
	public isSimple(): boolean {
		return this.children.length === 0;
	}

	/**
	 * Tests the state to see if it is a composite state (having one or more child regions).
	 * @returns True if the state has one or more child regions.
	 * @public
	 */
	public isComposite(): boolean {
		return this.children.length >= 1;
	}

	/**
	 * Tests the state to see if it is a composite state (having two or more child regions).
	 * @returns True if the state has two or more child regions.
	 * @public
	 */
	public isOrthogonal(): boolean {
		return this.children.length >= 2;
	}

	/**
	 * Returns true if the state is a final state. A final state is one that has no outgoing transitions therefore no more state transitions can occur in it's parent region.
	 */
	public isFinal(): boolean {
		return this.outgoing.length === 0;
	}

	/**
	 * Adds behaviour to the state to be called every time the state is entered.
	 * @param action The behaviour to call on state entry.
	 * @returns Returns the state.
	 * @public
	 */
	public entry(action: func.Consumer<any>): this {
		this.onEnter.unshift(action); // NOTE: we use unshift as the runtime iterates in reverse

		return this;
	}

	/**
	 * Adds behaviour to the state to be called every time the state is exited.
	 * @param action The behaviour to call on state exit.
	 * @returns Returns the state.
	 * @public
	 */
	public exit(action: func.Consumer<any>): this {
		this.onLeave.unshift(action); // NOTE: we use unshift as the runtime iterates in reverse

		return this;
	}

	/**
	 * Creates a new transition with a type test.
	 * @remarks Once creates with the [[State.on]] method, the transition can be enhanced using the fluent API calls of [[Transition.if]], [[Transition.to]]/[[Transition.local]] and [[Transition.do]].
	 * @param type The type of event that this transition will look for.
	 * @returns Returns the newly created transition.
	 * @public
	 */
	public on<TTrigger>(type: func.Constructor<TTrigger>): Transition<TTrigger> {
		return new Transition<TTrigger>(this, undefined, TransitionKind.internal, type);
	}

	public when<TTrigger>(guard: func.Predicate<TTrigger>): Transition<TTrigger> {
		return new Transition<TTrigger>(this, undefined, TransitionKind.internal, undefined, guard);
	}

	/**
	 * Creates a new external transition.
	 * @param TTrigger The type of the trigger event that may cause the transition to be traversed.
	 * @param target The target vertex of the external transition.
	 * @returns The external transition.
	 * @public
	 * @deprecated Use [[to]] method instead.
	 */
	public external<TTrigger>(target: Vertex): Transition<TTrigger> {
		return this.to(target);
	}

	/**
	 * Creates a new external transition.
	 * @param TTrigger The type of the trigger event that may cause the transition to be traversed.
	 * @param target The target vertex of the external transition.
	 * @returns If target is specified, returns an external transition otherwide an internal transition.
	 * @public
	 */
	public to<TTrigger>(target: Vertex | undefined = undefined): Transition<TTrigger> {
		return new Transition<TTrigger>(this, target);
	}

	/**
	 * Creates a new internal transition.
	 * @param TTrigger The type of the trigger event that may cause the transition to be traversed.
	 * @returns Returns the internal transition.
	 * @public
	 * @deprecated Use [[to]] method instead.
	 */
	public internal<TTrigger>(): Transition<TTrigger> {
		return this.to();
	}

	/**
	 * Creates a new local transition.
	 * @param TTrigger The type of the trigger event that may cause the transition to be traversed.
	 * @param target The target vertex of the local transition.
	 * @returns Returns the local transition.
	 * @public
	 * @deprecated Use to method instead.
	 */
	public local<TTrigger>(target: Vertex): Transition<TTrigger> {
		return new Transition<TTrigger>(this, target, TransitionKind.local);
	}

	/**
	 * Marks a particular type of event for deferral if it is not processed by the state. Deferred events are placed in the event pool for subsiquent evaluation.
	 * @param type The type of event that this state will defer.
	 * @returns Returns the state.
	 * @public
	 */
	public defer<TTrigger>(type: func.Constructor<TTrigger>): State {
		this.deferrableTrigger.unshift(type);

		return this;
	}

	/**
	 * Find a transition from the state given a trigger event.
	 * @param trigger The trigger event to evaluate transtions against.
	 * @returns Returns the trigger or undefined if none are found.
	 * @throws Throws an Error if more than one transition was found.
	 */
	getTransition(trigger: any): Transition | undefined {
		let result: Transition | undefined;

		// iterate through all outgoing transitions of this state looking for a single one whose guard evaluates true
		for (let i = this.outgoing.length; i--;) {
			if (this.outgoing[i].evaluate(trigger)) {
				assert.ok(!result, () => `Multiple transitions found at ${this} for ${trigger}`);
	
				result = this.outgoing[i];
			}
		}
	
		return result;
	}

	/**
	 * Execute the user defined state entry behaviour.
	 * @param trigger The trigger event that caused the transition.
	 */
	doEnter(trigger: any ) : void {
		for (let i = this.onEnter.length; i--;) {
			this.onEnter[i](trigger);
		}	
	}

	/**
	 * Execute the user defined state exit behaviour.
	 * @param trigger The trigger event that caused the transition.
	 */
	doLeave(trigger: any) : void {
		for (let i = this.onLeave.length; i--;) {
			this.onLeave[i](trigger);
		}
	}

	/**
	 * Returns the fully qualified name of the state.
	 * @public
	 */
	public toString(): string {
		return this.qualifiedName;
	}
}
