import { types, NamedElement, Vertex, Region, Instance, Visitor } from '.';

/**
 * A state is a situation in the lifecycle of the state machine that is stable between events.
 */
export class State extends Vertex {
	/**
	 * The child regions of the state.
	 * @internal
	 * @hidden
	 */
	children: Array<Region> = [];

	/**
	 * The types of events that may be deferred while in this state.
	 */
	private deferrableTriggers: Array<types.Constructor<any>> = [];

	/**
	 * The default region for a composite state where regions are not explicitly defined.
	 */
	private defaultRegion: Region | undefined;

	/**
	 * The user-defined actions that will be called upon state entry.
	 */
	private entryActions: Array<types.Consumer<any>> = [];

	/**
	 * The user-defined actions that will be called upon state exit.
	 */
	private exitActions: Array<types.Consumer<any>> = [];

	/**
	 * Creates a new instance of the state class.
	 * @param name The name of the state.
	 * @param parent The parent region of the state; note that another state can also be used, in which case the default region of the state will become this states parent. If parent is left undefined, then this state is the root of the state machine hierarchy.
	 */
	public constructor(name: string, parent: State | Region | undefined = undefined) {
		super(name, parent instanceof State ? parent.getDefaultRegion() : parent);
	}

	/**
	 * Adds a user-defined behaviour to call on state entry.
	 * @param actions One or callbacks that will be passed the trigger event.
	 * @return Returns the state thereby allowing a fluent style state construction.
	 */
	public entry(...actions: types.Consumer<any>[]): this {
		this.entryActions.push(...actions);

		return this;
	}

	/**
	 * Adds a user-defined behaviour to call on state exit.
	 * @param actions One or callbacks that will be passed the trigger event.
	 * @return Returns the state thereby allowing a fluent style state construction.
	 */
	public exit(...actions: Array<types.Consumer<any>>): this {
		this.exitActions.push(...actions);

		return this;
	}

	/**
	 * Adds the types of trigger event that can .
	 * @param actions One or callbacks that will be passed the trigger event.
	 * @return Returns the state thereby allowing a fluent style state construction.
	 */
	public defer(...type: types.Constructor<any>[]): this {
		this.deferrableTriggers.push(...type);

		return this;
	}

	/**
	 * Returns the default region for state and creates it if required; as used in the implicit creation of vertices.
	 * @returns The default state.
	 * @internal
	 * @hidden
	 */
	getDefaultRegion(): Region {
		return this.defaultRegion || (this.defaultRegion = new Region("default", this));
	}

	/**
	 * Tests a state to see if it is a simple state, one without and child regions.
	 * @returns Returns true if the state is a simple state.
	 */
	public isSimple(): boolean {
		return this.children.length === 0;
	}

	/**
	 * Tests a state to see if it is a composite state, one with one or more child regions.
	 * @returns Returns true if the state is a composite state.
	 */
	public isComposite(): boolean {
		return this.children.length > 0;
	}

	/**
	 * Tests a state to see if it is an orthogonal state, one with two or more child regions.
	 * @returns Returns true if the state is an orthogonal state.
	 */
	public isOrthogonal(): boolean {
		return this.children.length > 1;
	}

	/**
	 * Tests a state to see if it is a final state, one without outgoing transitions.
	 * @returns Returns true if the state is a final state.
	 */
	public isFinal(): boolean {
		return this.outgoing.length === 0;
	}

	/**
	 * Tests a state machine instance to see if this state is complete.
	 * A state is complete if it is a simple state, or if composite, all its child regions are complete.
	 * @returns Returns true if the state machine instance is complete for this state.
	 * @internal
	 * @hidden
	 */
	isComplete(instance: Instance): boolean {
		return !this.children.some(region => !region.isComplete(instance));
	}

	/**
	 * Evaluates a trigger event at this state to determine if it will trigger an outgoing transition.
	 * @param instance The state machine instance.
	 * @param history True if deep history semantics are in play.
	 * @param trigger The trigger event.
	 * @returns Returns true if one of outgoing transitions guard conditions passed.
	 * @remarks Prior to evaluating the trigger against the outcoing transitions, it delegates the trigger to children for evaluation thereby implementing depth-first evaluation of trigger events.
	 * @internal
	 * @hidden
	 */
	evaluate(instance: Instance, history: boolean, trigger: any): boolean {
		const result = this.delegate(instance, history, trigger) || super.evaluate(instance, history, trigger) || this.deferrable(instance, trigger);

		if (result) {
			this.completion(instance, history);
		}

		return result;
	}

	/**
	 * Delegates a trigger event to the children of this state to determine if it will trigger an outgoing transition.
	 * @param instance The state machine instance.
	 * @param history True if deep history semantics are in play.
	 * @param trigger The trigger event.
	 * @returns Returns true if a child state processed the trigger.
	 * @internal
	 * @hidden
	 */
	delegate(instance: Instance, history: boolean, trigger: any): boolean {
		let result: boolean = false;

		for (let i = 0, l = this.children.length; i < l && this.isActive(instance); ++i) {					// delegate to all children unless one causes a transition away from this state
			result = instance.getState(this.children[i]).evaluate(instance, history, trigger) || result;
		}

		return result;
	}

	/**
	 * Tests the trigger event to see if it can be deferred from this state.
	 * @param instance The state machine instance.
	 * @param trigger The trigger event.
	 * @returns Returns true if the type of the trigger event matched one of the user defined deferrable event types.
	 * @internal
	 * @hidden
	 */
	deferrable(instance: Instance, trigger: any): boolean {
		if (this.deferrableTriggers.indexOf(trigger.constructor) !== -1) {
			instance.defer(trigger);

			return true
		}

		return false;
	}

	/**
	 * Returns the list of deferable event types from the current active state configuration.
	 * @param instance The state machine instance.
	 * @returns Returns an array of the deferable event types from the current active state configuration.
	 * @internal
	 * @hidden
	 */
	getDeferrableTriggers(instance: Instance): Array<types.Constructor<any>> {
		return this.children.reduce((result, region) => result.concat(instance.getState(region).getDeferrableTriggers(instance)), this.deferrableTriggers);
	}

	/**
	 * Performs the initial steps required to enter a state during a state transition; updates teh active state configuration.
	 * @param instance The state machine instance that is entering the element.
	 * @param history Flag used to denote deep history semantics are in force at the time of entry.
	 * @param trigger The event that triggered the state transition.
	 * @internal
	 * @hidden
	 */
	doEnterHead(instance: Instance, history: boolean, trigger: any, next: NamedElement | undefined): void {
		if (next) {
			this.children.forEach(region => {
				if (region !== next) {
					region.doEnter(instance, history, trigger);
				}
			});
		}

		super.doEnterHead(instance, history, trigger, next);

		this.entryActions.forEach(action => action(trigger));
	}

	/**
	 * Performs the final steps required to enter a state during a state transition including cascading the entry operation to child elements and completion transition.
	 * @param instance The state machine instance that is entering the element.
	 * @param history Flag used to denote deep history semantics are in force at the time of entry.
	 * @param trigger The event that triggered the state transition.
	 * @internal
	 * @hidden
	 */
	doEnterTail(instance: Instance, history: boolean, trigger: any): void {
		this.children.forEach(region => region.doEnter(instance, history, trigger));

		this.completion(instance, history);
	}

	/**
	 * Exits a state during a state transition.
	 * @param instance The state machine instance that is exiting the element.
	 * @param history Flag used to denote deep history semantics are in force at the time of exit.
	 * @param trigger The event that triggered the state transition.
	 * @internal
	 * @hidden
	 */
	doExit(instance: Instance, history: boolean, trigger: any): void {
		this.children.forEach(region => region.doExit(instance, history, trigger));

		super.doExit(instance, history, trigger);

		this.exitActions.forEach(action => action(trigger));
	}

	/**
	 * Evaluates completion transitions at the state.
	 * @param instance The state machine instance that is exiting the element.
	 * @param history Flag used to denote deep history semantics are in force at the time of exit.
	 * @internal
	 * @hidden
	 */
	completion(instance: Instance, history: boolean): void {
		if (this.isComplete(instance)) {
			super.evaluate(instance, history, this);
		}
	}

	/**
	 * Accepts a visitor and calls visitor.visitStateHead method, cascades to child regions then calls the visitor.visitStateTail.
	 * @param visitor The visitor to call back.
	 */
	public accept(visitor: Visitor): void {
		visitor.visitStateHead(this);

		for (const region of this.children) {
			region.accept(visitor);
		}

		visitor.visitStateTail(this);
	}
}
