import { log, Region, State } from '.';
import { Transaction } from './Transaction';

/**
 * Represents an instance of a state machine model at runtime; there can be many seperate state machine instances using a common model.
 */
export class Instance {
	/** The stable active state configuration of the state machine, conveying the last known state for each region. */
	private activeStateConfiguration: Record<string, State> = {};

	/**
	 * The deferred triggers awaiting evaluation once the current active state configuration changes.
	 * @internal
	 * @hidden
	 */
	deferredEventPool: Array<any> = [];

	/**
	 * Creates a new state machine instance conforming to a particular state machine model.
	 * @param name The name of the state machine instance.
	 * @param root The root state of the state machine instance.
	 */
	public constructor(public readonly name: string, public readonly root: State) {
		this.transactional((transaction: Transaction) => this.root.doEnter(transaction, false, this.root)); // enter the root element
	}

	/**
	 * Evaluates a trigger event to see if it causes a state transition.
	 * @param trigger The trigger event to evaluate.
	 * @returns Returns true if the trigger event caused a change in the active state configuration or was deferred.
	 */
	public evaluate(trigger: any): boolean {
		log.write(() => `${this} evaluate ${trigger}`, log.Evaluate);

		return this.transactional((transaction: Transaction) => {
			const result = this.root.evaluate(transaction, false, trigger);		// evaluate the trigger event

			if (result && this.deferredEventPool.length !== 0) {				// if there are deferred events, process them
				this.evaluateDeferred(transaction);

				this.deferredEventPool = this.deferredEventPool.filter(t => t);	// repack the deferred event pool
			}

			return result;
		});
	}

	/**
	 * Performs an operation that may alter the active state configuration with a transaction.
	 * @param TReturn The return type of the transactional operation.
	 * @param operation The operation to perform within a transaction.
	 * @param transaction The current transaction being executed; if not passed explicitly, one will be created on demand.
	 * @return Returns the result of the operation.
	 */
	private transactional<TReturn>(operation: (transaction: Transaction) => TReturn, transaction: Transaction = new Transaction(this)): TReturn {
		const result = operation(transaction);

		Object.assign(this.activeStateConfiguration, transaction.activeStateConfiguration);

		return result;
	}

	/**
	 * Add a trigger event to the deferred event pool.
	 * @param trigger The trigger event to add to the deferred event pool.
	 * @internal
	 * @hidden
	 */
	defer(trigger: any): void {
		log.write(() => `${this} deferring ${trigger}`, log.Evaluate);

		this.deferredEventPool.push(trigger);
	}

	/**
	 * Evaluates trigger events in the deferred event pool.
	 */
	private evaluateDeferred(transaction: Transaction): void {
		this.deferredEventPool.forEach((trigger, i) => {
			if (trigger && this.root.getDeferrableTriggers(transaction).indexOf(trigger.constructor) === -1) {
				delete this.deferredEventPool[i];

				log.write(() => `${this} evaluate deferred ${trigger}`, log.Evaluate)

				if (this.root.evaluate(transaction, false, trigger)) {
					this.evaluateDeferred(transaction);

					return;
				}
			}
		});
	}

	/**
	 * Returns the last known state of a region from the stable active state configuration.
	 * @param region The region to find the last know state of.
	 * @returns Returns the last known state of the region or undefined if the region has not been entered.
	 */
	public getState(region: Region): State | undefined {
		return this.activeStateConfiguration[region.qualifiedName];
	}

	/**
	 * Returns the name of the state machine instance.
	 * @returns Returns the name of the state machine instance.
	 */
	public toString(): string {
		return this.name;
	}
}
