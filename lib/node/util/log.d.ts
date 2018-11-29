import { func } from "./func";
/**
 * Logging API used by @steelbreeze/state. Enables other logging solutions to be integrated.
 */
export declare namespace log {
    const Create: number;
    const Entry: number;
    const Exit: number;
    const Evaluate: number;
    const Transition: number;
    const Transaction: number;
    const User: number;
    const All: number;
    /**
     * Registers a callback used to log information log messages.
     * @param callback A function that takes a single string representing the informational message.
     * @param category A mask representing the types of message to log using the callback.
     * @returns Returns a reference to the callback so it can later be cancelled using remove.
     */
    function add(callback: func.Consumer<string>, category?: number): number;
    /**
     * Removes a previously registered logging callback.
     * @param ref The reference number returned by the call to add.
     */
    function remove(ref: number): void;
    /**
     * Write to the registered loggers
     * @param producer A callback to produce the log message if there is a suitable logger.
     * @param category The type of log message.
     */
    function info(producer: func.Producer<string>, category: number): void;
}
