import { Vertex } from './Vertex';

/**
 * Common base class for the three types of transition.
 * @param TTrigger The type of the trigger event that may cause this transition to be traversed.
 * @abstract
 * @public
 */
export abstract class Transition<TTrigger = any> {
	private typeTest: (event: TTrigger) => boolean = () => true;

	/**
	 * The guard condition that determines if the transition should be traversed given a trigger.
	 * @internal
	 */
	private guardTest: (event: TTrigger) => boolean = () => true;

	/**
	 * The behavior to call when the transition is traversed.
	 * @internal
	 */
	actions: Array<(trigger: TTrigger) => void> = [];

	/**
	 * Creates a new instance of the TransitionBase class.
	 * @param source The source vertex of the transition.
	 * @param target The target vertex of the transition.
	 * @protected
	 */
	protected constructor(source: Vertex, public readonly target: Vertex) {
		source.outgoing.unshift(this);
	}

	public on(trigger: new (...args: any[]) => TTrigger): this {
		this.typeTest = (event: TTrigger) => event.constructor === trigger;

		return this;
	}

	/**
	 * Adds a guard condition to the transition that determines if the transition should be traversed.
	 * @param predicate A callback predicate that takes the trigger as a parameter and returns a boolean.
     * @returns Returns the transition.
	 * @public
	 */
	public if(predicate: (event: TTrigger) => boolean): this {
		this.guardTest = predicate;

		return this;
	}

    /**
     * Adds behaviour to the transition to be called every time the transition is traversed.
     * @param action The behaviour to call on transition traversal.
     * @returns Returns the transition.
	 * @public
	 * @deprecated Use the do method instead.
     */
	public do(action: (trigger: TTrigger) => void): this {
		this.actions.unshift(action); // NOTE: we use unshift as the runtime iterates in reverse

		return this;
	}

    /**
     * Adds behaviour to the transition to be called every time the transition is traversed.
     * @param action The behaviour to call on transition traversal.
     * @returns Returns the transition.
	 * @public
     */
	public effect(action: (trigger: TTrigger) => void): this {
		return this.do(action);
	}

	/**
	 * Adds a guard condition to the transition that determines if the transition should be traversed given a trigger.
	 * @param predicate A callback predicate that takes the trigger as a parameter and returns a boolean.
     * @returns Returns the transition.
	 * @public
	 * @deprecated
	 */
	public when(predicate: (event: TTrigger) => boolean): this {
		return this.if(predicate);
	}

	/**
	 * Evaluates a trigger event against the transitions type test and guard condition to see if it should be traversed.
	 * @param event The triggering event.
	 * @return Returns true if the type test and guard conditions both pass.
	 * @internal
	 */
	evaluate(event: TTrigger): boolean {
		return this.typeTest(event) && this.guardTest(event);
	}
}