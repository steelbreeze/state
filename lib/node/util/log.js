"use strict";
exports.__esModule = true;
/**
 * Logging API used by @steelbreeze/state. Enables other logging solutions to be integrated.
 */
var log;
(function (log) {
    log.Create = 1;
    log.Entry = 2;
    log.Exit = 4;
    log.Evaluate = 8;
    log.Transition = 16;
    log.Transaction = 32;
    log.User = 64;
    log.All = log.Create | log.Entry | log.Exit | log.Evaluate | log.Transition | log.Transaction | log.User;
    /** The list of log consumers and the mask of the logging categories they accept */
    var consumers = [];
    /**
     * Registers a callback used to log information log messages.
     * @param callback A function that takes a single string representing the informational message.
     * @param category A mask representing the types of message to log using the callback.
     * @returns Returns a reference to the callback so it can later be cancelled using remove.
     */
    function add(callback, category) {
        if (category === void 0) { category = log.All; }
        return consumers.push({ callback: callback, category: category }) - 1;
    }
    log.add = add;
    /**
     * Removes a previously registered logging callback.
     * @param ref The reference number returned by the call to add.
     */
    function remove(ref) {
        consumers[ref] = undefined; // NOTE: same as delete but more explicit as to what's happening
    }
    log.remove = remove;
    /**
     * Write to the registered loggers
     * @param producer A callback to produce the log message if there is a suitable logger.
     * @param category The type of log message.
     */
    function info(producer, category) {
        var message;
        for (var i = consumers.length; i--;) {
            var consumer = consumers[i];
            if (consumer && consumer.category & category) {
                consumer.callback(message || (message = producer()));
            }
        }
    }
    log.info = info;
})(log = exports.log || (exports.log = {}));
