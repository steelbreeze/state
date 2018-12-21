import { func, log } from './util';
import { NamedElement } from './NamedElement';
import { Vertex } from './Vertex';
import { TransitionKind, Region, Transition, Instance } from './index';

/**
 * A state represents a condition in a state machine that is the result of the triggers processed.
 * @public
 */
export class State extends Vertex {
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
		super(name, parent);
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
	 * @param kind The kind of transition, defaults to external, but can also be local.
	 * @returns If target is specified, returns an external transition otherwide an internal transition.
	 * @public
	 */
	public to<TTrigger>(target: Vertex, kind: TransitionKind = TransitionKind.external): Transition<TTrigger> {
		return new Transition<TTrigger>(this, target, kind);
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
	 * Passes a trigger event to a state machine instance for evaluation
	 * @param state The state to evaluate the trigger event against.
	 * @param instance The state machine instance to evaluate the trigger against.
	 * @param deepHistory True if deep history semantics are invoked.
	 * @param trigger The trigger event
	 * @returns Returns true if the trigger was consumed by the state.
	 * @hidden
	 */
	evaluate(instance: Instance, deepHistory: boolean, trigger: any): boolean {
		const result = this.delegate(instance, deepHistory, trigger) || this.accept(instance, deepHistory, trigger) || this.deferTrigger(instance, trigger);

		// check completion transitions if the trigger caused as state transition and this state is still active
		if (result && this.parent && instance.getState(this.parent) === this) {
			this.completion(instance, deepHistory, this);
		}

		return result;
	}

	/** Delegate a trigger to children for evaluation */
	private delegate(instance: Instance, deepHistory: boolean, trigger: any): boolean {
		let result: boolean = false;

		// delegate to the current state of child regions for evaluation
		for (let i = this.children.length; i--;) {
			if (instance.getState(this.children[i]).evaluate(instance, deepHistory, trigger)) {
				result = true;

				// if a transition in a child state causes us to exit this state, break out now 
				if (this.parent && instance.getState(this.parent) !== this) {
					break;
				}
			}
		}

		return result;
	}

	/** Evaluates the trigger event against the list of deferred transitions and defers into the event pool if necessary. */
	private deferTrigger(instance: Instance, trigger: any): boolean {
		let result = false;

		if (this.deferrableTrigger.indexOf(trigger.constructor) !== -1) {
			instance.defer(this, trigger);

			result = true;
		}

		return result;
	}

	/** Initiate state entry */
	enterHead(instance: Instance, deepHistory: boolean, trigger: any, nextElement: NamedElement | undefined): void {
		// when entering a state indirectly (part of the target ancestry in a transition that crosses region boundaries), ensure all child regions are entered
		if (nextElement) {
			// enter all child regions except for the next in the ancestry
			for (const region of this.children) {
				if (region !== nextElement) {
					region.enter(instance, deepHistory, trigger);
				}
			}
		}

		log.info(() => `${instance} enter ${this}`, log.Entry);

		// update the current state and vertex of the parent region
		instance.setState(this);

		// perform the user defined entry behaviour
		for (let i = this.onEnter.length; i--;) {
			this.onEnter[i](trigger);
		}
	}

	/** Complete state entry */
	enterTail(instance: Instance, deepHistory: boolean, trigger: any): void {
		// cascade the enter operation to child regions
		for (let i = this.children.length; i--;) {
			this.children[i].enter(instance, deepHistory, trigger);
		}

		// test for completion transitions
		this.completion(instance, deepHistory, this);
	}

	/** Leave a state */
	leave(instance: Instance, deepHistory: boolean, trigger: any): void {
		// cascade the leave operation to all child regions
		for (var i = this.children.length; i--;) {
			this.children[i].leave(instance, deepHistory, trigger);
		}

		log.info(() => `${instance} leave ${this}`, log.Exit);

		// perform the user defined leave behaviour
		for (let i = this.onLeave.length; i--;) {
			this.onLeave[i](trigger);
		}
	}

	/** Checks for and executes completion transitions */
	completion(instance: Instance, deepHistory: boolean, trigger: any): void {
		// check to see if the state is complete; fail fast if its not
		for (let i = this.children.length; i--;) {
			if (!instance.getState(this.children[i]).isFinal()) {
				return;
			}
		}

		// look for transitions
		this.accept(instance, deepHistory, trigger);
	}
}
