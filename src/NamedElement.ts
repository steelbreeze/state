import { Instance } from './index';

/**
 * A named element is a part of the state machine hierarchy.
 * @param TParent The type of the parent of the named element.
 */
export abstract class NamedElement<TParent = any> {
	/**
	 * The fully qualified name of the named element, including parent names.
	 */
	readonly qualifiedName: string;

	protected constructor(public readonly name: string, public readonly parent: TParent ) {
		this.qualifiedName = parent ? `${parent}.${name}` :  name;
	}

	enter(instance: Instance, deepHistory: boolean, trigger: any): void {
		this.enterHead(instance, deepHistory, trigger, undefined);
		this.enterTail(instance, deepHistory, trigger);
	}

	abstract enterHead(instance: Instance, deepHistory: boolean, trigger: any, nextElement: NamedElement | undefined): void;
	abstract enterTail(instance: Instance, deepHistory: boolean, trigger: any): void;
	abstract leave(instance: Instance, deepHistory: boolean, trigger: any): void;
	
	/**
	 * Returns the fully qualified name of the state.
	 */
	public toString(): string {
		return this.qualifiedName;
	}
}