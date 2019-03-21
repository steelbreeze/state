"use strict";
exports.__esModule = true;
var log;
(function (log) {
    var consumers = [];
    log.Create = 1;
    log.Entry = 2;
    log.Exit = 4;
    log.Evaluate = 8;
    log.Transition = 16;
    log.Transaction = 32;
    log.User = 64;
    function add(consumer, category) {
        return consumers.push({ consumer: consumer, category: category });
    }
    log.add = add;
    function remove(index) {
        delete consumers[index];
    }
    log.remove = remove;
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
