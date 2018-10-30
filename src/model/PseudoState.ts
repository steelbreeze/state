import { log } from '../util';
import { PseudoStateKind, Starting } from './PseudoStateKind';
import { Region } from './Region';
import { State } from './State';
import { Transition } from './Transition';
import { ExternalTransition } from './ExternalTransition';

/**
 * A pseudo state is a transient elemement within a state machine, once entered it will evaluate outgoing transitions and attempt to exit.
 * @public
 */
export class PseudoState {
	public readonly parent: Region;

	/**
	 * The fully qualified name of the vertex including its parent's qualified name.
	 * @public
	 */
	public readonly qualifiedName: string;

	/**
	 * The outgoing transitions available from this vertex.
	 */
	outgoing: Array<Transition> = [];

	/** 
	 * The else transition that may be used by branch pseudo states; saves the costly process of searching for it at runtime.
	 * @internal 
	 */
	elseTransition: ExternalTransition | undefined;

	/**
	 * Creates a new instance of the PseudoState class.
	 * @param name The name of the pseudo state.
	 * @param parent The parent region of the pseudo state; a state may also be specified in which case the state's default region will be used as the parent region.
	 * @param kind The kind of pseudo state; this defines its behaviour and use. See PseudoStateKind for more information.
	 * @public
	 */
	public constructor(public readonly name: string, parent: State | Region, public readonly kind: PseudoStateKind = PseudoStateKind.Initial) {
		this.parent = parent instanceof State ? parent.getDefaultRegion() : parent;
		this.qualifiedName = `${this.parent}.${this.name}`;

		this.parent.children.unshift(this);

		if (this.kind & Starting) {
			if (this.parent.starting) {
				throw new Error(`Only one initial pseudo state is allowed in region ${this.parent}`);
			}

			this.parent.starting = this;
		}

		log.info(() => `Created ${this}`, log.Create);
	}

	/**
	 * Creates a new external transition.
	 * @param target The target vertex of the external transition.
	 * @returns The external transition.
	 * @public
	 */
	public external<TTrigger>(target: State | PseudoState): ExternalTransition<TTrigger> {
		return new ExternalTransition<TTrigger>(this, target);
	}

	/**
	 * Creates a new external transition.
	 * @param target The target vertex of the external transition.
	 * @returns The external transition.
	 * @public
	 * @deprecated
	 */
	public to<TTrigger>(target: State | PseudoState): ExternalTransition<TTrigger> {
		return this.external(target);
	}

	/**
	 * Creates a new else transition for branch (junction and choice) pseudo states; else transitions are selected if no other transitions guard conditions evaluate true.
	 * @param target The target of the transition.
	 * @returns Returns the new else transition.
	 * @public
	 */
	public else<TTrigger>(target: State | PseudoState): ExternalTransition<TTrigger> {
		if (this.elseTransition) {
			throw new Error(`Only 1 else transition allowed at ${this}.`);
		}

		return this.elseTransition = new ExternalTransition<TTrigger>(this, target).when(() => false);
	}

	/**
	 * Returns the fully qualified name of the pseudo state.
	 * @public
	 */
	public toString(): string {
		return this.qualifiedName;
	}
}