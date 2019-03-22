import { random } from './random';
import { PseudoStateKind, Vertex, Region, State, Transition, Instance } from '.';

export class PseudoState extends Vertex {
	private elseTransition: Transition | undefined;

	public constructor(name: string, parent: State | Region, public readonly kind: PseudoStateKind = PseudoStateKind.Initial) {
		super(name, parent instanceof State ? parent.getDefaultRegion() : parent);

		this.getTransition = this.kind === PseudoStateKind.Choice ? (instance, trigger) => random.get(this.outgoing.filter(transition => transition.evaluate(trigger))) || this.elseTransition : (instance, trigger) => super.getTransition(instance, trigger) || this.elseTransition;

		if (this.kind === PseudoStateKind.Initial || this.kind === PseudoStateKind.DeepHistory || this.kind === PseudoStateKind.ShallowHistory) {
			this.parent!.initial = this;
		}
	}

	public else(target: Vertex): Transition<any> {
		if (this.kind === PseudoStateKind.Choice || this.kind === PseudoStateKind.Junction) {
			this.elseTransition = new Transition(this).to(target).when(() => false);
		} else {
			throw new Error(`Unable to create else transition from ${this}`);
		}

		return this.elseTransition;
	}

	public isHistory(): boolean {
		return this.kind === PseudoStateKind.DeepHistory || this.kind === PseudoStateKind.ShallowHistory;
	}

	doEnterTail(instance: Instance, history: boolean, trigger: any): void {
		if (this.kind !== PseudoStateKind.Junction) {
			this.evaluate(instance, history, trigger);
		}
	}
}
