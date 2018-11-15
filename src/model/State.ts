import { assert, log } from '../util';
import { Region } from './Region';
import { Transition } from './Transition';
import { ExternalTransition } from './ExternalTransition';
import { LocalTransition } from './LocalTransition';
import { InternalTransition } from './InternalTransition';
import { PseudoState } from './PseudoState';

/**
 * A state represents a condition in a state machine that is the result of the triggers processed.
 * @public
 */
export class State {
	public readonly parent: Region | undefined;
	/**
	 * The fully qualified name of the vertex including its parent's qualified name.
	 * @public
	 */
	public readonly qualifiedName: string;

	/**
	 * The outgoing transitions available from this vertex.
	 */
	public outgoing: Array<Transition> = [];

	/**
	 * The child regions belonging to this state.
	 * @internal
	 */
	children: Array<Region> = [];

	/**
	 * The default region used when creating state machine models with implicit regions.
	 * @internal
	 */
	defaultRegion: Region | undefined;

	/**
	 * The behaviour to each time the state is entered.
	 * @internal
	 */
	onEnter: Array<(trigger: any) => void> = [];

	/**
	 * The behaviour to perform each time the is state exited.
	 * @internal
	 */
	onLeave: Array<(trigger: any) => void> = [];

	/**
	 * Creates a new instance of the State class.
	 * @param name The name of the state.
	 * @param parent The parent region of the state or a state whose default region will be used as the parent region.
	 * If left undefined, this state is the root state in a state machine model.
	 * @public
	 */
	public constructor(public readonly name: string, parent: State | Region | undefined = undefined) {
		this.parent = parent instanceof State ? parent.getDefaultRegion() : parent;

		if (this.parent) {
			assert.ok(!this.parent.children.filter((vertex): vertex is State => vertex instanceof State && vertex.name === this.name).length, () => `State names must be unique within a region`);
			this.qualifiedName = `${this.parent}.${name}`;
			this.parent.children.unshift(this);
		} else {
			this.qualifiedName = name;
		}

		log.info(() => `Created ${this}`, log.Create);

	}

	/**
	 * Returns the default state of the region; creates one if it does not already exist.
	 * @returns Returns the default region.
	 * @public
	 */
	public getDefaultRegion(): Region {
		return this.defaultRegion || (this.defaultRegion = new Region(this.name, this));
	}

	/**
	 * Tests the state to see if it is a simple state (having no child regions).
	 * @returns True if the state has no child regions.
	 * @public
	 */
	public isSimple(): boolean {
		return this.children.length === 0;
	}

	/**
	 * Tests the state to see if it is a composite state (having one or more child regions).
	 * @returns True if the state has one or more child regions.
	 * @public
	 */
	public isComposite(): boolean {
		return this.children.length >= 1;
	}

	/**
	 * Tests the state to see if it is a composite state (having two or more child regions).
	 * @returns True if the state has two or more child regions.
	 * @public
	 */
	public isOrthogonal(): boolean {
		return this.children.length >= 2;
	}

	/**
	 * Adds behaviour to the state to be called every time the state is entered.
	 * @param action The behaviour to call on state entry.
	 * @returns Returns the state.
	 * @public
	 */
	public entry(action: (trigger: any) => void): this {
		this.onEnter.unshift(action); // NOTE: we use unshift as the runtime iterates in reverse

		return this;
	}

	/**
	 * Adds behaviour to the state to be called every time the state is exited.
	 * @param action The behaviour to call on state exit.
	 * @returns Returns the state.
	 * @public
	 */
	public exit(action: (trigger: any) => void): this {
		this.onLeave.unshift(action); // NOTE: we use unshift as the runtime iterates in reverse

		return this;
	}

	/**
	 * Creates a new external transition.
	 * @param TTrigger The type of the trigger event that may cause the transition to be traversed.
	 * @param target The target vertex of the external transition.
	 * @returns The external transition.
	 * @public
	 */
	public external<TTrigger>(target: State | PseudoState): ExternalTransition<TTrigger> {
		return new ExternalTransition<TTrigger>(this, target);
	}

	/**
	 * Creates a new external transition.
	 * @param TTrigger The type of the trigger event that may cause the transition to be traversed.
	 * @param target The target vertex of the external transition.
	 * @returns If target is specified, returns an external transition otherwide an internal transition.
	 * @public
	 * @deprecated
	 */
	public to<TTrigger>(target: State | PseudoState | undefined): Transition<TTrigger> {
		return target ? this.external(target) : this.internal();
	}

	/**
	 * Creates a new internal transition.
	 * @param TTrigger The type of the trigger event that may cause the transition to be traversed.
	 * @returns Returns the internal transition.
	 * @public
	 */
	public internal<TTrigger>(): InternalTransition<TTrigger> {
		return new InternalTransition<TTrigger>(this);
	}

	/**
	 * Creates a new local transition.
	 * @param TTrigger The type of the trigger event that may cause the transition to be traversed.
	 * @param target The target vertex of the local transition.
	 * @returns Returns the local transition.
	 * @public
	 */
	public local<TTrigger>(target: State | PseudoState): LocalTransition<TTrigger> {
		return new LocalTransition<TTrigger>(this, target);
	}

	/**
	 * Returns the fully qualified name of the state.
	 * @public
	 */
	public toString(): string {
		return this.qualifiedName;
	}
}
