import { log } from './util';
import { IInstance } from './IInstance';

/**
 * A named element is a part of the state machine hierarchy.
 * @param TParent The type of the parent of the named element.
 */
export abstract class NamedElement<TParent = any> {
	/**
	 * The fully qualified name of the named element, including parent names.
	 */
	private readonly qualifiedName: string;

	protected constructor(public readonly name: string, public readonly parent: TParent) {
		this.qualifiedName = parent ? `${parent}.${name}` : name;

		log.info(() => `Created ${this}`, log.Create);
	}

	enter(instance: IInstance, deepHistory: boolean, trigger: any): void {
		this.enterHead(instance, deepHistory, trigger, undefined);
		this.enterTail(instance, deepHistory, trigger);
	}

	enterHead(instance: IInstance, deepHistory: boolean, trigger: any, nextElement: NamedElement | undefined): void {
		log.info(() => `${instance} enter ${this}`, log.Entry);
	}

	abstract enterTail(instance: IInstance, deepHistory: boolean, trigger: any): void;

	leave(instance: IInstance, deepHistory: boolean, trigger: any): void {
		log.info(() => `${instance} leave ${this}`, log.Exit);
	}

	/**
	 * Returns the fully qualified name of the state.
	 */
	toString(): string {
		return this.qualifiedName;
	}
}
