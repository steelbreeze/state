import { Consumer, Producer } from './types';
/**
 * Logging integration for state; provides callbacks for logging events thereby allowing integration of third party logging tools.
 */
export declare namespace log {
    /** Logging category used when new state machine elements are created. */
    const Create = 1;
    /** Logging category used when states are entered during state machine instance initialisation or state transitions. */
    const Entry = 2;
    /** Logging category used when states are exited during state machine instance initialisation or state transitions. */
    const Exit = 4;
    /** Logging category used when trigger events are evaluated during state transitions. */
    const Evaluate = 8;
    /** Logging category used when state transitions are traversed. */
    const Transition = 16;
    /** Logging category used for user generated log events. */
    const User = 128;
    /**
     * Adds a new log event consumer that will be called when log events of a particular category or categories are raised.
     * @param consumer The callback that will be invoked with the log message.
     * @param categories The categorory or categories for which the consumer callback will be invoked.
     * @returns Returns an id for the consumer so that it can be removed if desired.
     */
    function add(consumer: Consumer<string>, ...categories: number[]): number;
    /**
     * Removes a log event consumer.
     * @param index The id of the consumer previously returned by the add function.
     */
    function remove(index: number): void;
    /**
     * Raises a log event
     * @param producer A callback used to generate the log message.
     * @param category The category of message.
     * @remarks The producer callback will only be called if there is a registered consumer for the category of message.
     */
    function write(producer: Producer<string>, category: number): void;
}
