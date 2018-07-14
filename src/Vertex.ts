import { TransitionKind } from './TransitionKind';
import { NamedElement } from './NamedElement';
import { Region } from './Region';
import { Transition, State, StateMachine } from './state';

/** The source or target of a [transition]{@link Transition} within a [state machine model]{@link StateMachine}. A vertex can be either a [[State]] or a [[PseudoState]]. */
export abstract class Vertex extends NamedElement<Region> {
	/** The set of possible [transitions]{@link Transition} that this [vertex]{@link Vertex} can be the source of. */
	public readonly outgoing = new Array<Transition>();

	/** The set of possible [transitions]{@link Transition} that this [vertex]{@link Vertex} can be the target of. */
	public readonly incoming = new Array<Transition>();

	/** Creates a new instance of the [[Vertex]] class.
	 * @param name The name of this [vertex]{@link Vertex}.
	 * @param parent The parent [element]{@link IElement} of this [vertex]{@link Vertex}. If a [state]{@link State} or [state machine]{@link StateMachine} is specified, its [default region]{@link State.defaultRegion} used as the parent.
	 */
	protected constructor(name: string, parent: Region | State | StateMachine) {
		super(name, parent instanceof Region ? parent : parent.defaultRegion() || new Region(Region.defaultName, parent));

		this.parent.children.push(this);
	}

	/** Creates a new [transition]{@link Transition} from this [vertex]{@link Vertex}.
	 * @param target The [vertex]{@link Vertex} to [transition]{@link Transition} to. Leave this as undefined to create an [internal transition]{@link TransitionKind.Internal}.
	 * @param kind The kind of the [transition]{@link Transition}; use this to explicitly set [local transition]{@link TransitionKind.Local} semantics as needed.
	 */
	public to(target?: Vertex, kind: TransitionKind = TransitionKind.External): Transition {
		return new Transition(this, target, kind);
	}
}
