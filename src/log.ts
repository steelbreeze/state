/** Interface used by state.js for managing log and error messages. */
export interface ILogger {
	/**
	 * Passes a log (informational) message.
	 * @param message Any number of objects constituting the log message.
	 */
	log(message?: any, ...optionalParams: any[]): void;

	/**
	 * Passes an erorr message.
	 * @param message Any number of objects constituting the error message.
	 */
	error(message?: any, ...optionalParams: any[]): void;
}

/**
 * Default logger implementation.
 * @hidden
 */
export let logger: ILogger = {
	log(message?: any, ...optionalParams: any[]): void { },
	error(message?: any, ...optionalParams: any[]): void { throw message; }
};

/**
 * Overrides the current logging object.
 * @param value An object to pass log and error messages to.
 * @returns Returns the previous logging object in use.
 */
export function setLogger(value: ILogger): ILogger {
	const result = logger;

	logger = value;

	return result;
}
