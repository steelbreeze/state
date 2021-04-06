import { Consumer, Producer } from './types';

/**
 * Logging integration for state; provides callbacks for logging events thereby allowing integration of third party logging tools.
 */
export namespace log {
	/** The registered logging consumers. */
	const consumers: Array<{ consumer: Consumer<string>, category: number }> = [];

	/** Logging category used when new state machine elements are created. */
	export const Create = 1;

	/** Logging category used when states are entered during state machine instance initialisation or state transitions. */
	export const Entry = 2;

	/** Logging category used when states are exited during state machine instance initialisation or state transitions. */
	export const Exit = 4;

	/** Logging category used when trigger events are evaluated during state transitions. */
	export const Evaluate = 8;

	/** Logging category used when state transitions are traversed. */
	export const Transition = 16;

	/** Logging category used for user generated log events. */
	export const User = 128;

	/**
	 * Adds a new log event consumer that will be called when log events of a particular category or categories are raised.
	 * @param consumer The callback that will be invoked with the log message.
	 * @param categories The categorory or categories for which the consumer callback will be invoked.
	 * @returns Returns an id for the consumer so that it can be removed if desired.
	 */
	export function add(consumer: Consumer<string>, ...categories: number[]): number {
		return consumers.push({ consumer, category: categories.reduce((p, c) => p | c) });
	}

	/**
	 * Removes a log event consumer.
	 * @param index The id of the consumer previously returned by the add function.
	 */
	export function remove(index: number): void {
		delete consumers[index];
	}

	/**
	 * Raises a log event
	 * @param producer A callback used to generate the log message.
	 * @param category The category of message.
	 * @remarks The producer callback will only be called if there is a registered consumer for the category of message.
	 */
	export function write(producer: Producer<string>, category: number): void {
		let message: string | undefined;

		for (const consumer of consumers) {
			if (consumer && category & consumer.category) {
				consumer.consumer(message || (message = producer()));
			}
		}
	}
}
