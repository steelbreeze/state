import { log } from '.';
import { Transaction } from './Transaction';

/**
 * Represents an element within a state machine model hierarchy.
 * The model hierarchy is an arbitrary tree structure representing composite state machines.
 */
export abstract class NamedElement {
	/**
	 * The fully qualified name of the element; a composition of the name of element and all its parent elements.
	 */
	public readonly qualifiedName: string;

	/**
	 * Creates a new instance of an element.
	 * @param name The name of the element.
	 * @param parent The parent of this element.
	 */
	protected constructor(public readonly name: string, parent: NamedElement | undefined) {
		this.qualifiedName = parent ? `${parent}.${name}` : name;

		log.write(() => `Created ${this}`, log.Create);
	}

	/**
	 * Returns the parent element of this element.
	 * @returns Returns the parent element of this element or undefined if the element is the root element of the hierarchy.
	 * @internal
	 * @hidden
	 */
	abstract getParent(): NamedElement | undefined;

	/**
	 * Returns the ancestry of this element from the root element of the hierarchy to this element.
	 * @returns Returns an iterable iterator used to process the ancestors.
	 * @internal
	 * @hidden
	 */
	*getAncestors(): IterableIterator<NamedElement> {
		const parent = this.getParent();

		if (parent) {
			yield* parent.getAncestors();
		}

		yield this;
	}

	/**
	 * Enters an element during a state transition.
	 * @param transaction The current transaction being executed.
	 * @param history Flag used to denote deep history semantics are in force at the time of entry.
	 * @param trigger The event that triggered the state transition.
	 * @internal
	 * @hidden
	 */
	doEnter(transaction: Transaction, history: boolean, trigger: any): void {
		this.doEnterHead(transaction, history, trigger, undefined);
		this.doEnterTail(transaction, history, trigger);
	}

	/**
	 * Performs the initial steps required to enter an element during a state transition.
	 * @param transaction The current transaction being executed.
	 * @param history Flag used to denote deep history semantics are in force at the time of entry.
	 * @param trigger The event that triggered the state transition.
	 * @internal
	 * @hidden
	 */
	doEnterHead(transaction: Transaction, history: boolean, trigger: any, next: NamedElement | undefined): void {
		log.write(() => `${transaction.instance} enter ${this}`, log.Entry);
	}

	/**
	 * Performs the final steps required to enter an element during a state transition including cascading the entry operation to child elements and completion transition.
	 * @param transaction The current transaction being executed.
	 * @param history Flag used to denote deep history semantics are in force at the time of entry.
	 * @param trigger The event that triggered the state transition.
	 * @internal
	 * @hidden
	 */
	abstract doEnterTail(transaction: Transaction, history: boolean, trigger: any): void;

	/**
	 * Exits an element during a state transition.
	 * @param transaction The current transaction being executed.
	 * @param history Flag used to denote deep history semantics are in force at the time of exit.
	 * @param trigger The event that triggered the state transition.
	 * @internal
	 * @hidden
	 */
	doExit(transaction: Transaction, history: boolean, trigger: any): void {
		log.write(() => `${transaction.instance} leave ${this}`, log.Exit);
	}

	/**
	 * Returns the element in string form; the fully qualified name of the element.
	 */
	public toString(): string {
		return this.qualifiedName;
	}
}
