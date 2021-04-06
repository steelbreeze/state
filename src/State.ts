import { NamedElement, Vertex, Region, Visitor } from '.';
import { Transaction } from './Transaction';
import { Behaviour, Producer } from './types';

/**
 * A state is a situation in the lifecycle of the state machine that is stable between events.
 */
export class State extends Vertex {
	/** The parent region of the vertex. */
	public readonly parent: Region | undefined;

	/**
	 * The child regions of the state.
	 * @internal
	 * @hidden
	 */
	children: Array<Region> = [];

	/**
	 * The types of events that may be deferred while in this state.
	 */
	private deferrableTriggers: Array<Producer<any>> = [];

	/**
	 * The default region for a composite state where regions are not explicitly defined.
	 */
	private defaultRegion: Region | undefined;

	/**
	 * The user-defined actions that will be called upon state entry.
	 */
	private entryActions: Array<Behaviour<any>> = [];

	/**
	 * The user-defined actions that will be called upon state exit.
	 */
	private exitActions: Array<Behaviour<any>> = [];

	/**
	 * Creates a new instance of the state class.
	 * @param name The name of the state.
	 * @param parent The parent region of the state; note that another state can also be used, in which case the default region of the state will become this states parent. If parent is left undefined, then this state is the root of the state machine hierarchy.
	 */
	public constructor(name: string, parent: State | Region | undefined = undefined) {
		super(name, parent instanceof State ? parent.getDefaultRegion() : parent);
		this.parent = parent instanceof State ? parent.getDefaultRegion() : parent;

		if (this.parent) {
			this.parent.children.push(this);
		}
	}
	
	/**
	 * Adds a user-defined behaviour to call on state entry.
	 * @param actions One or callbacks that will be passed the trigger event.
	 * @return Returns the state thereby allowing a fluent style state construction.
	 */
	public entry(...actions: Behaviour<any>[]): this {
		this.entryActions.push(...actions);

		return this;
	}

	/**
	 * Adds a user-defined behaviour to call on state exit.
	 * @param actions One or callbacks that will be passed the trigger event.
	 * @return Returns the state thereby allowing a fluent style state construction.
	 */
	public exit(...actions: Array<Behaviour<any>>): this {
		this.exitActions.push(...actions);

		return this;
	}

	/**
	 * Adds the types of trigger event that can .
	 * @param actions One or callbacks that will be passed the trigger event.
	 * @return Returns the state thereby allowing a fluent style state construction.
	 */
	public defer(...type: Producer<any>[]): this {
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
	isComplete(transaction: Transaction): boolean {
		return !this.children.some(region => !region.isComplete(transaction));
	}

	/**
	 * Evaluates a trigger event at this state to determine if it will trigger an outgoing transition.
	 * @param transaction The current transaction being executed.
	 * @param history True if deep history semantics are in play.
	 * @param trigger The trigger event.
	 * @returns Returns true if one of outgoing transitions guard conditions passed.
	 * @remarks Prior to evaluating the trigger against the outcoing transitions, it delegates the trigger to children for evaluation thereby implementing depth-first evaluation of trigger events.
	 * @internal
	 * @hidden
	 */
	evaluate(transaction: Transaction, history: boolean, trigger: any): boolean {
		const result = this.delegate(transaction, history, trigger) || super.evaluate(transaction, history, trigger) || this.deferrable(transaction, trigger);

		if (result) {
			this.completion(transaction, history);
		}

		return result;
	}

	/**
	 * Delegates a trigger event to the children of this state to determine if it will trigger an outgoing transition.
	 * @param transaction The current transaction being executed.
	 * @param history True if deep history semantics are in play.
	 * @param trigger The trigger event.
	 * @returns Returns true if a child state processed the trigger.
	 * @internal
	 * @hidden
	 */
	delegate(transaction: Transaction, history: boolean, trigger: any): boolean {
		let result: boolean = false;

		for (let i = 0, l = this.children.length; i < l && this.isActive(transaction); ++i) {					// delegate to all children unless one causes a transition away from this state
			const state = transaction.getState(this.children[i]);

			if(state) {
				result = state.evaluate(transaction, history, trigger) || result;
			}
		}

		return result;
	}

	/**
	 * Tests the trigger event to see if it can be deferred from this state.
	 * @param transaction The current transaction being executed.
	 * @param trigger The trigger event.
	 * @returns Returns true if the type of the trigger event matched one of the user defined deferrable event types.
	 * @internal
	 * @hidden
	 */
	deferrable(transaction: Transaction, trigger: any): boolean {
		if (this.deferrableTriggers.indexOf(trigger.constructor) !== -1) {
			transaction.instance.defer(trigger);

			return true
		}

		return false;
	}

	/**
	 * Returns the list of deferable event types from the current active state configuration.
	 * @param transaction The current transaction being executed.
	 * @returns Returns an array of the deferable event types from the current active state configuration.
	 * @internal
	 * @hidden
	 */
	getDeferrableTriggers(transaction: Transaction): Array<Producer<any>> {
		return this.children.reduce((result, region) => {
			const state = transaction.getState(region);

			return state !== undefined ? result.concat(state.getDeferrableTriggers(transaction)) : result;
		}, this.deferrableTriggers);
	}

	/**
	 * Performs the initial steps required to enter a state during a state transition; updates teh active state configuration.
	 * @param transaction The current transaction being executed.
	 * @param history Flag used to denote deep history semantics are in force at the time of entry.
	 * @param trigger The event that triggered the state transition.
	 * @internal
	 * @hidden
	 */
	doEnterHead(transaction: Transaction, history: boolean, trigger: any, next: NamedElement | undefined): void {
		if (next) {
			this.children.forEach(region => {
				if (region !== next) {
					region.doEnter(transaction, history, trigger);
				}
			});
		}

		super.doEnterHead(transaction, history, trigger, next);

		this.entryActions.forEach(action => action(trigger, transaction.instance));
	}

	/**
	 * Performs the final steps required to enter a state during a state transition including cascading the entry operation to child elements and completion transition.
	 * @param transaction The current transaction being executed.
	 * @param history Flag used to denote deep history semantics are in force at the time of entry.
	 * @param trigger The event that triggered the state transition.
	 * @internal
	 * @hidden
	 */
	doEnterTail(transaction: Transaction, history: boolean, trigger: any): void {
		this.children.forEach(region => region.doEnter(transaction, history, trigger));

		this.completion(transaction, history);
	}

	/**
	 * Exits a state during a state transition.
	 * @param transaction The current transaction being executed.
	 * @param history Flag used to denote deep history semantics are in force at the time of exit.
	 * @param trigger The event that triggered the state transition.
	 * @internal
	 * @hidden
	 */
	doExit(transaction: Transaction, history: boolean, trigger: any): void {
		this.children.forEach(region => region.doExit(transaction, history, trigger));

		super.doExit(transaction, history, trigger);

		this.exitActions.forEach(action => action(trigger, transaction.instance));
	}

	/**
	 * Evaluates completion transitions at the state.
	 * @param transaction The current transaction being executed.
	 * @param history Flag used to denote deep history semantics are in force at the time of exit.
	 * @internal
	 * @hidden
	 */
	completion(transaction: Transaction, history: boolean): void {
		if (this.isComplete(transaction)) {
			super.evaluate(transaction, history, this);
		}
	}

	/**
	 * Accepts a visitor and calls visitor.visitStateHead method, cascades to child regions then calls the visitor.visitStateTail.
	 * @param visitor The visitor to call back.
	 */
	public accept(visitor: Visitor): void {
		visitor.visitState(this);

		for (const region of this.children) {
			region.accept(visitor);
		}

		visitor.visitStateTail(this);
	}
}
