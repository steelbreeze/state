import { func, log } from '../util';
import { Vertex } from './Vertex';
import { TransitionPath } from './TransitionPath';
import { TransitionKind } from './TransitionKind';

/**
 * A transition between vertices that defines a valid change in state in response to an event.
 * @param TTrigger The type of triggering event that causes this transition to be traversed.
 */
export class Transition<TTrigger = any> {
	/**
	 * A test to ensure that a trigger event is the expected type in order for the transition to be traversed.
	 * @internal
	 */
	private typeTest: func.Predicate<TTrigger> = () => true;

	/**
	 * A user-defined guard condition that must be true for the transition to be traversed.
	 * @internal
	 */
	private guard: func.Predicate<TTrigger> = () => true;

	/**
	 * The elements that need to be left and entered when traversing a transition
	 * @internal
	 */
	path: TransitionPath;

	/**
	 * The behavior to call when the transition is traversed.
	 * @internal
	 */
	actions: Array<func.Consumer<TTrigger>> = [];

	/**
	 * Creates an instance of the Transition class.
	 * @param source The source [[Vertex]] of the transition.
	 * @param target The target [[Vertex]] of the transition; leave undefined for internal transitions.
	 * @param kind The kind of the transition: external, internal or local.
	 * @public
	 */
	public constructor(public readonly source: Vertex, public target: Vertex | undefined = undefined, kind: (source: Vertex, taget: Vertex | undefined) => TransitionPath = target ? TransitionKind.external : TransitionKind.internal) {
		// derive the transition traversal behaviour based on its source, target and kind.
		this.path = kind(this.source, this.target);

		// add this transition to the set of outgoing transitions of the source vertex.
		source.outgoing.unshift(this);

		log.info(() => `Created transition from ${source}`, log.Create);
	}

	/**
	 * Adds a predicate to the transition to ensure events must be of a certain event type for the transition to be traversed.
	 * @param type The type of event to test for.
	 * @return Returns the transition.
	 * @public
	 */
	public on(type: func.Constructor<TTrigger>): this {
		this.typeTest = trigger => trigger.constructor === type;

		return this;
	}

	/**
	 * Adds a guard condition to the transition enabling event details to determine if the transition should be traversed.
	 * @param type A predicate taking the trigger event as a parameter.
	 * @return Returns the transition.
	 * @public
	 */
	public when(guard: func.Predicate<TTrigger>): this {
		this.guard = guard;

		return this;
	}

	/**
	 * Specifies the target vertex, thereby making the transition an external transition.
	 * @param target The target vertex of the transition
	 * @return Returns the transition.
	 * @public
	 */
	public to(target: Vertex, type: ((source: Vertex, target: Vertex) => TransitionPath) = TransitionKind.external): this {
		this.target = target;
		this.path = type(this.source, this.target);

		return this;
	}

	/**
     * Adds behaviour to the transition to be called every time the transition is traversed.
	 * @remarks You may make multiple calls to this method to add more behaviour.
     * @param action The behaviour to call on transition traversal.
     * @returns Returns the transition.
	 * @public
     */
	public do(action: func.Consumer<TTrigger>): this {
		this.actions.unshift(action);

		return this;
	}

	/**
	 * Tests an event against the type test and guard condition to see if the event might cause this transition to be traversed.
	 * @param trigger The triggering event.
	 * @returns Returns true if the trigger passes the type test and guard condition.
	 * @internal
	 */
	evaluate(trigger: TTrigger): boolean {
		return this.typeTest(trigger) && this.guard(trigger);
	}

	/**
	 * A pseudonym of [[Transition.when]].
	 * @param type A predicate taking the trigger event as a parameter.
	 * @return Returns the transition.
	 * @public
	 * @deprecated Use Transition.when in its place. This method will be removed in the v8.0 release.
	 */
	public if(guard: func.Predicate<TTrigger>): this {
		return this.when(guard);
	}

	/**
	 * Specifies the target vertex which is a child of the source and specify it as a local transition.
	 * @param target The target vertex of the transition
	 * @return Returns the transition.
	 * @public
	 * @deprecated Use the to method with the transition type of local
	 */
	public local(target: Vertex | undefined = undefined): this {
		if (this.target = (this.target || target)) {
			this.path = TransitionKind.local(this.source, this.target);
		}

		return this;
	}

    /**
     * A pseudonym of do.
     * @param action The behaviour to call on transition traversal.
     * @returns Returns the transition.
	 * @public
	 * @deprecated Use Transition.do instead. This method will be removed in the v8.0 release.
     */
	public effect(action: func.Consumer<TTrigger>): this {
		return this.do(action);
	}
}
