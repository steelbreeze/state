export namespace log {
	export const Create: number = 1;
	export const Entry: number = 2;
	export const Exit: number = 4;
	export const Evaluate: number = 8;
	export const Transition: number = 16;
	export const Transaction: number = 32;
	export const User: number = 64;
	export const All: number = Create | Entry | Exit | Evaluate | Transition | Transaction | User;

	/** The list of log consumers and the mask of the logging categories they accept */
	const consumers: Array<{ callback: (message: string) => void; category: number; } | undefined> = [];

	/**
	 * Registers a callback used to log information log messages.
	 * @param callback A function that takes a single string representing the informational message.
	 * @param category A mask representing the types of message to log using the callback.
	 * @returns Returns a reference to the callback so it can later be cancelled using remove.
	 */
	export function add(callback: (message: string) => void, category: number = All): number {
		return consumers.push({ callback: callback, category: category }) - 1;
	}

	/**
	 * Removes a previously registered logging callback.
	 * @param ref The reference number returned by the call to add.
	 */
	export function remove(ref: number): void {
		consumers[ref] = undefined; // NOTE: same as delete but more explicit as to what's happening
	}

	/**
	 * Write to the registered loggers
	 * @param producer A callback to produce the log message if there is a suitable logger.
	 * @param category The type of log message.
	 */
	export function info(producer: () => string, category: number): void {
		let message: string | undefined;

		for (let i = consumers.length; i--;) {
			const consumer = consumers[i];

			if (consumer && consumer.category & category) {
				consumer.callback(message || (message = producer()));
			}
		}
	}
}
