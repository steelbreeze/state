import { log, Region, State } from '.';
import { Transaction } from './Transaction';

/**
 * Represents an instance of a state machine model at runtime; there can be many seperate state machine instances using a common model.
 */
export class Instance extends Map<Region, State> {
	/** The currently active transaction */
	private transaction: Transaction | undefined;

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
		super();

		this.transactional((transaction: Transaction) => {
			this.root.doEnter(transaction, false, this.root);	// enter the root element

			this.evaluateDeferred(transaction);					// the process of initialisation may have caused a deferred event
		});
	}

	/**
	 * Evaluates a trigger event to see if it causes a state transition.
	 * @param trigger The trigger event to evaluate.
	 * @returns Returns true if the trigger event caused a change in the active state configuration or was deferred.
	 */
	public evaluate(trigger: any): boolean {
		log.write(() => `${this} evaluate ${trigger}`, log.Evaluate);

		if (this.transaction) {
			this.defer(trigger);

			return false;
		} else {
			return this.transactional((transaction: Transaction) => {
				const result = this.root.evaluate(transaction, false, trigger);	// evaluate the trigger event

				if (result) {
					this.evaluateDeferred(transaction);
				}

				return result;
			});
		}
	}

	/**
	 * Performs an operation that may alter the active state configuration with a transaction.
	 * @param TReturn The return type of the transactional operation.
	 * @param operation The operation to perform within a transaction.
	 * @return Returns the result of the operation.
	 */
	private transactional<TReturn>(operation: (transaction: Transaction) => TReturn): TReturn {
		try {
			// create a new transaction
			this.transaction = new Transaction(this);

			// perform the requested operation
			const result = operation(this.transaction);

			// update the instance active state configuration from the transaction
			for (const [key, value] of this.transaction) {
				this.set(key, value);
			}

			return result;
		} finally {
			// remove the transaction
			this.transaction = undefined;
		}
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
	 * @hidden
	 */
	private evaluateDeferred(transaction: Transaction): void {
		if (this.deferredEventPool.length !== 0) {
			for (let i = 0; i < this.deferredEventPool.length; i++) {
				const trigger = this.deferredEventPool[i];

				if (trigger && this.root.getDeferrableTriggers(transaction).indexOf(trigger.constructor) === -1) {
					delete this.deferredEventPool[i];

					log.write(() => `${this} evaluate deferred ${trigger}`, log.Evaluate)

					if (this.root.evaluate(transaction, false, trigger)) {
						this.evaluateDeferred(transaction);

						break;
					}
				}
			}

			this.deferredEventPool = this.deferredEventPool.filter(t => t);	// repack the deferred event pool
		}
	}

	/**
	 * Returns the name of the state machine instance.
	 * @returns Returns the name of the state machine instance.
	 */
	public toString(): string {
		return this.name;
	}
}
