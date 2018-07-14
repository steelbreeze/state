import { NamedElement } from './NamedElement';
import { Vertex } from './Vertex';
import { Visitor } from './Visitor';
import { State, StateMachine, IInstance } from './state';

/** A region is an orthogonal part of either a [composite state]{@link State} or a [state machine]{@link StateMachine}. It is container of [vertices]{@link Vertex} and has no behavior associated with it. */
export class Region extends NamedElement<State | StateMachine> {
	/** The default name of regions that are dynamically created. */
	static defaultName: string = "default";

	/** The child [vertices]{@link Vertex} of this [region]{@link Region}. */
	public readonly children = new Array<Vertex>();

	/** Creates a new instance of the [[Region]] class.
	 * @param name The name of this [element]{@link NamedElement}.
	 * @param parent The parent [element]{@link IElement} of this [element]{@link NamedElement}.
	 */
	public constructor(name: string, parent: State | StateMachine) {
		super(name, parent);

		this.parent.children.push(this);
	}

	/** Tests a given [state machine instance]{@link IInstance} to see if this [region]{@link Region} is active. A [region]{@link Region} is active when it has been entered but not exited.
	 * @param instance The [state machine instance]{@link IInstance} to test if this [region]{@link Region} is active within.
	 * @return Returns true if the [region]{@link Region} is active.
	 */
	public isActive(instance: IInstance): boolean {
		return this.parent.isActive(instance);
	}

	/** Tests a given [state machine instance]{@link IInstance} to see if this [region]{@link Region} is complete. A [region]{@link Region} is complete when it's current active [state]{@link State} is a [final state]{@link State.isFinal} (one that has no outbound [transitions]{@link Transition}.
	 * @param instance The [state machine instance]{@link IInstance} to test if this [region]{@link Region} is complete within.
	 * @return Returns true if the [region]{@link Region} is complete.
	 */
	public isComplete(instance: IInstance): boolean {
		const currentState = instance.getLastKnownState(this);

		return currentState !== undefined && currentState.isFinal();
	}

	/** Accepts a [visitor]{@link Visitor} object.
	 * @param visitor The [visitor]{@link Visitor} object.
	 * @param args Any optional arguments to pass into the [visitor]{@link Visitor} object.
	 */
	public accept(visitor: Visitor, ...args: any[]): any {
		return visitor.visitRegion(this, ...args);
	}
}