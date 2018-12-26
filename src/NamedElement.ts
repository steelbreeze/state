import { log } from './util';
import { Instance } from './index';

/**
 * A named element is a part of the state machine hierarchy.
 * @param TParent The type of the parent of the named element.
 */
export abstract class NamedElement<TParent = any> {
	/**
	 * The fully qualified name of the named element, including parent names.
	 */
	public readonly qualifiedName: string;

	/**
	 * Creates a new instance of the NamedElement class
	 * @param name The name of the named element.
	 * @param parent The parent element of the named element.
	 */
	protected constructor(public readonly name: string, public readonly parent: TParent) {
		this.qualifiedName = parent ? `${parent}.${name}` : name;

		log.info(() => `Created ${this}`, log.Create);
	}

	/**
	 * Enter an element during state machine execution.
	 * @param instance The state machine instance.
	 * @param deepHistory True if deep history semantics are in force at the time of entry.
	 * @param trigger The trigger event that caused the entry operation.
	 * @internal
	 */
	enter(instance: Instance, deepHistory: boolean, trigger: any): void {
		this.enterHead(instance, deepHistory, trigger, undefined);
		this.enterTail(instance, deepHistory, trigger);
	}

	/**
	 * Enter an element, without cascading the entry operation.
	 * @param instance The state machine instance.
	 * @param deepHistory True if deep history semantics are in force at the time of entry.
	 * @param trigger The trigger event that caused the entry operation.
	 * @param nextElement The next element to be entered after this one (used to assist regino entry)
	 * @internal
	 */
	enterHead(instance: Instance, deepHistory: boolean, trigger: any, nextElement: NamedElement | undefined): void {
		log.info(() => `${instance} enter ${this}`, log.Entry);
	}

	/**
	 * Cascade the entry operation to child elements as required.
	 * @param instance The state machine instance.
	 * @param deepHistory True if deep history semantics are in force at the time of entry.
	 * @param trigger The trigger event that caused the entry operation.
	 * @internal
	 */
	abstract enterTail(instance: Instance, deepHistory: boolean, trigger: any): void;

	/**
	 * Leaves an element and cascades the leaver operation to child eleemtns as required
	 * @param instance The state machine instance.
	 * @param deepHistory True if deep history semantics are in force at the time of exiting the element.
	 * @param trigger The trigger event that caused the entry operation.
	 * @internal
	 */
	leave(instance: Instance, deepHistory: boolean, trigger: any): void {
		log.info(() => `${instance} leave ${this}`, log.Exit);
	}

	/**
	 * Returns the fully qualified name of the named element.
	 */
	public toString(): string {
		return this.qualifiedName;
	}
}