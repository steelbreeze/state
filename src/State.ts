import { types, NamedElement, Vertex, Region, Instance } from '.';

export class State extends Vertex {
	children: Array<Region> = [];
	private deferrableTrigger: Array<types.Constructor<any>> = [];
	private defaultRegion: Region | undefined;
	private entryActions: Array<types.Consumer<any>> = [];
	private exitActions: Array<types.Consumer<any>> = [];

	public constructor(name: string, parent: State | Region | undefined = undefined) {
		super(name, parent instanceof State ? parent.getDefaultRegion() : parent);
	}

	public entry(...actions: Array<types.Consumer<any>>): this {
		this.entryActions.push(...actions);

		return this;
	}

	public exit(...actions: Array<types.Consumer<any>>): this {
		this.exitActions.push(...actions);

		return this;
	}

	public defer(...type: types.Constructor<any>[]): this {
		this.deferrableTrigger.push(...type);

		return this;
	}

	public getDefaultRegion(): Region {
		return this.defaultRegion || (this.defaultRegion = new Region("default", this));
	}

	public isSimple(): boolean {
		return this.children.length === 0;
	}

	public isComposite(): boolean {
		return this.children.length > 0;
	}

	public isOrthogonal(): boolean {
		return this.children.length > 1;
	}

	public isFinal(): boolean {
		return this.outgoing.length === 0;
	}

	public isComplete(instance: Instance): boolean {
		return !this.children.some(region => !region.isComplete(instance));
	}

	evaluate(instance: Instance, history: boolean, trigger: any): boolean {
		const result = this.delegate(instance, history, trigger) || super.evaluate(instance, history, trigger) || this.doDefer(instance, trigger);

		if (result) {
			this.completion(instance, history);
		}

		return result;
	}

	delegate(instance: Instance, history: boolean, trigger: any): boolean {
		let result: boolean = false;

		for (const region of this.children) {
			if (instance.getState(region).evaluate(instance, history, trigger)) {
				result = true;

				if (this.parent && instance.getState(this.parent) !== this) {
					break;
				}
			}
		}

		return result;
	}

	doDefer(instance: Instance, trigger: any): boolean {
		if (this.deferrableTrigger.indexOf(trigger.constructor) !== -1) {
			instance.defer(instance, trigger);

			return true
		}

		return false;
	}

	getDeferred(instance: Instance): Array<types.Constructor<any>> {
		return this.children.reduce((result, region) => result.concat(instance.getState(region).getDeferred(instance)), this.deferrableTrigger);
	}

	doEnterHead(instance: Instance, history: boolean, trigger: any, next: NamedElement | undefined): void {
		if (next) this.children.forEach(region => { if (region !== next) region.doEnter(instance, history, trigger); });

		super.doEnterHead(instance, history, trigger, next);

		this.entryActions.forEach(action => action(trigger));
	}

	doEnterTail(instance: Instance, history: boolean, trigger: any): void {
		this.children.forEach(region => region.doEnter(instance, history, trigger));

		this.completion(instance, history);
	}

	doExit(instance: Instance, history: boolean, trigger: any): void {
		this.children.forEach(region => region.doExit(instance, history, trigger));

		super.doExit(instance, history, trigger);

		this.exitActions.forEach(action => action(trigger));
	}

	completion(instance: Instance, history: boolean): void {
		if (this.isComplete(instance)) {
			super.evaluate(instance, history, this);
		}
	}
}
