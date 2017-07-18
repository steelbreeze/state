"use strict";
exports.__esModule = true;
/**
 * Default logger implementation.
 * @hidden
 */
exports.logger = {
    log: function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
    },
    error: function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        throw message;
    }
};
/**
 * Overrides the current logging object.
 * @param value An object to pass log and error messages to.
 * @returns Returns the previous logging object in use.
 */
function setLogger(value) {
    var result = exports.logger;
    exports.logger = value;
    return result;
}
exports.setLogger = setLogger;
