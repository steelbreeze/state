import { log } from '../util';
import { NamedElement } from './NamedElement';
import { State } from './State';
import { PseudoState } from './PseudoState';
import { Vertex } from './Vertex';

/**
 * A region is a container of vertices (states and pseudo states) in a state machine model.
 * @public
 */
export class Region implements NamedElement<State> {
	/**
	 * The fully qualified name of the region including its parent's qualified name.
	 * @public
	 */
	public readonly qualifiedName: string;

	/**
	 * The child vertices belonging to this region.
	 * @internal
	 */
	children: Array<Vertex> = [];

	/**
	 * The initial starting pseudo state of this region; saves the costly process of searching for it at runtime.
	 * @internal
	 */
	starting: PseudoState | undefined;

	/**
	 * Creates a new instance of the Region class.
	 * @param name The name of the region.
	 * @param parent The parent state of the region.
	 * @public
	 */
	public constructor(public readonly name: string, public readonly parent: State) {
		this.qualifiedName = `${parent}.${name}`;

		this.parent.children.unshift(this);

		log.info(() => `Created region ${this}`, log.Create);
	}

	/**
	 * Returns the fully qualified name of the region.
	 * @public
	 */
	public toString(): string {
		return this.qualifiedName;
	}
}
