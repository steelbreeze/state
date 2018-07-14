/** The interface used for logging and error reporting */
export interface Logger {
	/**
	 * A method used to log informational messages
	 * @param message The informational message to log.
	 */
	log(message: string): any;

	/**
	 * A method used to log error messages
	 * @param message The error to log.
	 */
	error(message: string): any;
}

/**
 * The object used for logging and error reporting; by default using console
 * @hidden
 */
export let logger: Logger = console;

/**
 * Enables custom logging and error reporting for state.js thereby allowing you to interface with logging / error reporting tools of your own choosing.
 * @param value The new logging and error reporting object; must have two methods, log and error that both take a string.
 * @return Returns tthe previous logging and error reporting object in use.
 */
export function setLogger(value: Logger): Logger {
	const result = logger;

	logger = value;

	return result;
}