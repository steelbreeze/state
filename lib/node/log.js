"use strict";
exports.__esModule = true;
/**
 * Logging integration for state; provides callbacks for logging events thereby allowing integration of third party logging tools.
 */
var log;
(function (log) {
    /** The registered logging consumers. */
    var consumers = [];
    /** Logging category used when new state machine elements are created. */
    log.Create = 1;
    /** Logging category used when states are entered during state machine instance initialisation or state transitions. */
    log.Entry = 2;
    /** Logging category used when states are exited during state machine instance initialisation or state transitions. */
    log.Exit = 4;
    /** Logging category used when trigger events are evaluated during state transitions. */
    log.Evaluate = 8;
    /** Logging category used when state transitions are traversed. */
    log.Transition = 16;
    /** Logging category used for user generated log events. */
    log.User = 128;
    /**
     * Adds a new log event consumer that will be called when log events of a particular category or categories are raised.
     * @param consumer The callback that will be invoked with the log message.
     * @param categories The categorory or categories for which the consumer callback will be invoked.
     * @returns Returns an id for the consumer so that it can be removed if desired.
     */
    function add(consumer) {
        var categories = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            categories[_i - 1] = arguments[_i];
        }
        return consumers.push({ consumer: consumer, category: categories.reduce(function (p, c) { return p | c; }) });
    }
    log.add = add;
    /**
     * Removes a log event consumer.
     * @param index The id of the consumer previously returned by the add function.
     */
    function remove(index) {
        delete consumers[index];
    }
    log.remove = remove;
    /**
     * Raises a log event
     * @param producer A callback used to generate the log message.
     * @param category The category of message.
     * @remarks The producer callback will only be called if there is a registered consumer for the category of message.
     */
    function write(producer, category) {
        var message;
        consumers.forEach(function (consumer) {
            if (consumer && category & consumer.category) {
                consumer.consumer(message || (message = producer()));
            }
        });
    }
    log.write = write;
})(log = exports.log || (exports.log = {}));
