import { log, Region, State } from '.';
import { Transaction } from './Transaction';

/**
 * Represents an instance of a state machine model at runtime; contains the active state configuration and manages transactions.
 * There can be many seperate state machine instances using a common model.
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
			// enter the root element
			this.root.doEnter(transaction, false, this.root);

			// the process of initialisation may have caused a deferred event
			this.evaluateDeferred(transaction);
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

			// commit the transaction by updating the active state configuration
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
	 * Evaluates deferred trigger events.
	 * @hidden
	 */
	private evaluateDeferred(transaction: Transaction): void {
		if (this.deferredEventPool.length !== 0) {
			this.processDeferred(transaction);

			// repack the deferred event pool
			this.deferredEventPool = this.deferredEventPool.filter(t => t);
		}
	}

	/**
	 * Processes the deferred event pool.
	 * @hidden 
	 */
	private processDeferred(transaction: Transaction): void {
		// iterate over the pool
		this.deferredEventPool.forEach((trigger, i) => {
			// if the deferred trigger is in the deferable event types from the current active state configuration, it can be processed
			if (trigger && this.root.getDeferrableTriggers(transaction).indexOf(trigger.constructor) === -1) { // NOTE: test on trigger necessary as this is recursive and the pool may not have been repacked
				// remove the event from the pool
				delete this.deferredEventPool[i];

				log.write(() => `${this} evaluate deferred ${trigger}`, log.Evaluate)

				// process the event
				if (this.root.evaluate(transaction, false, trigger)) {
					// if the event caused a transition, we can test the pool from the start again
					this.processDeferred(transaction);

					return;
				}
			}
		});
	}

	/**
	 * Returns the name of the state machine instance.
	 * @returns Returns the name of the state machine instance.
	 */
	public toString(): string {
		return this.name;
	}
}
