import { TransitionKind, NamedElement, Region, Transition, Instance } from '.';

/**
 * Represents an element within a state machine model hierarchy that can be the source or target of a transition.
 * Vertices are contained within regions.
 */
export abstract class Vertex extends NamedElement {
	/** The transitions originating from this vertex. */
	public readonly outgoing: Array<Transition> = [];

	/**
	 * Creates a new instance of the vertex class.
	 * @param name The name of the vertex.
	 * @param parent The parent region of this vertex.
	 * @protected 
	 */
	protected constructor(name: string, public readonly parent: Region | undefined) {
		super(name, parent);

		if (this.parent) {
			this.parent.children.push(this);
		}
	}

	/**
	 * Returns the parent element of this element.
	 * @returns Returns the parent element of this element or undefined if the element is the root element of the hierarchy.
	 * @internal
	 */
	getParent(): NamedElement | undefined {
		return this.parent;
	}

	/**
	 * Creates a new transition at this vertex triggered by an event of a specific type.
	 * @param TTrigger The type of the triggering event.
	 * @param type The type (class name) of the triggering event.
	 * @returns Returns a new typed transition. A typed transition being one whose guard condition and behaviour will accept a parameter of the same type specified.
	 * @remarks The generic parameter TTrigger is not generally required as this will be
	 */
	public on<TTrigger>(type: new (...args: any[]) => TTrigger): Transition<TTrigger> {
		return new Transition<TTrigger>(this).on(type);
	}

	/**
	 * Creates a new transition at this vertex with a guard condition.
	 * @param TTrigger The type of the triggering event.
	 * @param guard The guard condition to determine if the transition should be traversed.
	 * @returns Returns a new transition; if TTrigger is specified, a typed transition will be returned.
	 */
	public when<TTrigger = any>(guard: (trigger: TTrigger) => boolean): Transition<TTrigger> {
		return new Transition<TTrigger>(this).when(guard);
	}

	public to(target: Vertex, kind: TransitionKind = TransitionKind.External): Transition<any> {
		return new Transition(this).to(target, kind);
	}

	public isActive(instance: Instance): boolean {
		return this.parent ? instance.getVertex(this.parent) === this : true;
	}

	evaluate(instance: Instance, history: boolean, trigger: any): boolean {
		const transition = this.getTransition(instance, trigger);

		if (transition) {
			transition.doTraverse(instance, history, trigger);

			return true;
		}

		return false;
	}

	getTransition(instance: Instance, trigger: any): Transition | undefined {
		return this.outgoing.filter(transition => transition.evaluate(trigger))[0]; // TODO: use Array.find
	}

	doEnterHead(instance: Instance, history: boolean, trigger: any, next: NamedElement | undefined): void {
		super.doEnterHead(instance, history, trigger, next);

		instance.setVertex(this);
	}
}
