import { func, log } from './util';
import { Vertex } from './Vertex';
import { PseudoStateKind, TransitionKind, PseudoState, Instance } from './index';
import { TransitionActivation } from './TransitionActivation';

/**
 * A transition between vertices that defines a valid change in state in response to an event.
 * @param TTrigger The type of triggering event that causes this transition to be traversed.
 */
export class Transition<TTrigger = any> {
	/**
	 * The source vertex of the transition.
	 */
	public readonly source: Vertex;

	/**
	 * The target vertex of the transition.
	 */
	public target: Vertex;

	/**
	 * A test to ensure that a trigger event is the expected type in order for the transition to be traversed.
	 * @internal
	 */
	private typeGuard: func.Predicate<TTrigger>;

	/**
	 * A user-defined guard condition that must be true for the transition to be traversed.
	 * @internal
	 */
	private userGuard: func.Predicate<TTrigger> = () => true;

	/**
	 * The semantics for transition traversal.
	 * @internal
	 */
	activation: TransitionActivation;

	/**
	 * The behavior to call when the transition is traversed.
	 * @internal
	 */
	private onTraverse: Array<func.Consumer<TTrigger>> = [];

	/**
	 * Creates an instance of the Transition class.
	 * @param source The source vertex of the transition.
	 * @param target The optional target vertex of the transition; leave undefined for internal transitions.
	 * @param kind The optional kind of the transition: external, internal or local. If left blank, this will be external if a targed vertex is specified otherwise internal.
	 * @param type The optional type of the trigger event that will cause this transition to be traversed. If left undefined any object or primative type will be considered.
	 * @public
	 */
	public constructor(source: Vertex, target: Vertex | undefined = undefined, kind: TransitionKind = (target ? TransitionKind.external : TransitionKind.internal), type: func.Constructor<TTrigger> | undefined = undefined, guard: func.Predicate<TTrigger> = () => true) {
		this.source = source;
		this.target = target || source;
		this.activation = new TransitionKind.map[kind](this.source, this.target);
		this.typeGuard = type ? (trigger: TTrigger) => trigger.constructor === type : () => true;
		this.userGuard = guard;

		// add this transition to the set of outgoing transitions of the source vertex.
		source.outgoing.unshift(this);

		log.info(() => `Created ${this}`, log.Create);
	}

	/**
	 * Adds a predicate to the transition to ensure events must be of a certain event type for the transition to be traversed.
	 * @param type The type of event to test for.
	 * @return Returns the transition.
	 * @public
	 */
	public on(type: func.Constructor<TTrigger>): this {
		this.typeGuard = trigger => trigger.constructor === type;

		return this;
	}

	/**
	 * Adds a guard condition to the transition enabling event details to determine if the transition should be traversed.
	 * @param type A predicate taking the trigger event as a parameter.
	 * @return Returns the transition.
	 * @public
	 */
	public when(guard: func.Predicate<TTrigger>): this {
		this.userGuard = guard;

		return this;
	}

	/**
	 * Specifies the target vertex, thereby making the transition an external transition.
	 * @param target The target vertex of the transition
	 * @return Returns the transition.
	 * @public
	 */
	public to(target: Vertex, kind: TransitionKind = TransitionKind.external): this {
		this.target = target;
		this.activation = new TransitionKind.map[kind](this.source, this.target);

		log.info(() => `- converted to ${this}`, log.Create);

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
		this.onTraverse.unshift(action);

		return this;
	}

	/**
	 * Tests an event against the type test and guard condition to see if the event might cause this transition to be traversed.
	 * @param trigger The triggering event.
	 * @returns Returns true if the trigger passes the type test and guard condition.
	 * @internal
	 */
	evaluate(trigger: TTrigger): boolean {
		return this.typeGuard(trigger) && this.userGuard(trigger);
	}

	/** Traverse a transition */
	traverse(instance: Instance, deepHistory: boolean, trigger: any): void {
		let transition: Transition<any> = this;
		const transitions: Array<Transition> = [transition];

		// gather all transitions to be taversed either side of static conditional branches (junctions)
		while (transition.target instanceof PseudoState && transition.target.kind === PseudoStateKind.Junction) {
			transitions.unshift(transition = transition.target.getTransition(trigger)!);
		}
		
		// traverse all transitions
		for (let i = transitions.length; i--;) {
			log.info(() => `Executing ${transitions[i]}`, log.Transition);

			// leave elements below the common ancestor
			transitions[i].activation.exitSource(instance, deepHistory, trigger);

			// perform the transition behaviour
			for (let j = transitions[i].onTraverse.length; j--;) {
				transitions[i].onTraverse[j](trigger);
			}

			// enter elements below the common ancestor to the target
			transitions[i].activation.enterTarget(instance, deepHistory, trigger);
		}
	}

	public toString(): string {
		return `${this.activation} transition from ${this.source} to ${this.target}`;
	}
}
