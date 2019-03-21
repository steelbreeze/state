import { PseudoStateKind, NamedElement, Vertex, State, PseudoState, Instance } from '.';

export class Region extends NamedElement {
	children: Array<Vertex> = [];
	initial: PseudoState | undefined;

	public constructor(name: string, public readonly parent: State) {
		super(name, parent);

		parent.children.push(this);
	}

	getParent(): NamedElement | undefined {
		return this.parent;
	}

	public isComplete(instance: Instance): boolean {
		const currentState = instance.getState(this);

		return currentState && currentState.isFinal();
	}

	doEnterTail(instance: Instance, history: boolean, trigger: any): void {
		let current: State | undefined;
		let starting: Vertex | undefined = this.initial;

		if ((history || (this.initial && this.initial.isHistory())) && (current = instance.getState(this))) {
			starting = current;
			history = history || (this.initial!.kind === PseudoStateKind.DeepHistory);
		}

		if (starting) {
			starting.doEnter(instance, history, trigger);
		} else {
			throw new Error(`${instance} unable to find initial or history vertex at ${this}`);
		}
	}

	doExit(instance: Instance, history: boolean, trigger: any): void {
		instance.getVertex(this).doExit(instance, history, trigger);

		super.doExit(instance, history, trigger);
	}
}
