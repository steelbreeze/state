"use strict";
exports.__esModule = true;
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
    var consumers = [];
    /**
     * Registers a callback used to log information log messages.
     * @param callback A function that takes a single string representing the informational message.
     * @param category A mask representing the types of message to log using the callback.
     * @returns Returns the id of the callback so it can later be cancelled using unsetInfo.
     */
    function add(callback, category) {
        if (category === void 0) { category = log.All; }
        return consumers.push({ callback: callback, category: category }) - 1;
    }
    log.add = add;
    function remove(ref) {
        consumers[ref] = undefined; // NOTE: same as delete but more explicit as to what's happening
    }
    log.remove = remove;
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
    function assert(condition, onFalse) {
        if (!condition) {
            throw new Error(onFalse());
        }
    }
    log.assert = assert;
})(log = exports.log || (exports.log = {}));
