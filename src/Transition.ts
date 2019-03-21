import { log, PseudoStateKind, TransitionKind, Vertex, PseudoState, Instance } from '.';
import { TransitionStrategy } from './TransitionStrategy';
import { ExternalTransitionStrategy } from './ExternalTransitionStrategy';
import { InternalTransitionStrategy } from './InternalTransitionStrategy';
import { LocalTransitionStrategy } from './LocalTransitionStrategy';

const TransitionStrategyMap = {
	external: ExternalTransitionStrategy,
	internal: InternalTransitionStrategy,
	local: LocalTransitionStrategy
}

export class Transition<TTrigger = any> {
	public target: Vertex;
	private eventType: (new (...args: any[]) => TTrigger) | undefined;
	private guard: ((trigger: TTrigger) => boolean) | undefined;
	private traverseActions: Array<(trigger: TTrigger) => any> = [];
	private strategy: TransitionStrategy;

	constructor(public readonly source: Vertex) {
		this.target = source;
		this.strategy = new TransitionStrategyMap[TransitionKind.Internal](this.source, this.target);

		this.source.outgoing.push(this);
	}

	on(eventType: new (...args: any[]) => TTrigger): this {
		this.eventType = eventType;

		return this;
	}

	when(guard: (trigger: TTrigger) => boolean): this {
		this.guard = guard;

		return this;
	}

	to(target: Vertex, kind: TransitionKind = TransitionKind.External): this {
		this.target = target;
		this.strategy = new TransitionStrategyMap[kind](this.source, this.target);

		return this;
	}

	effect(...actions: Array<(trigger: TTrigger) => any>): this {
		this.traverseActions.push(...actions);

		return this;
	}

	evaluate(trigger: any): boolean {
		return (this.eventType === undefined || trigger.constructor === this.eventType) && (this.guard === undefined || this.guard(trigger));
	}

	doTraverse(instance: Instance, history: boolean, trigger: any): void {
		var transition: Transition = this;
		const transitions: Array<Transition> = [transition];

		while (transition.target instanceof PseudoState && transition.target.kind === PseudoStateKind.Junction) {
			transitions.push(transition = transition.target.getTransition(instance, trigger)!);
		}

		transitions.forEach(t => t.execute(instance, history, trigger));
	}

	execute(instance: Instance, history: boolean, trigger: any): void {
		log.write(() => `${instance} traverse ${this}`, log.Transition);

		this.strategy.doExitSource(instance, history, trigger);

		this.traverseActions.forEach(action => action(trigger));

		this.strategy.doEnterTarget(instance, history, trigger);
	}

	public toString(): string {
		return `transition from ${this.source} to ${this.target}`;
	}
}
