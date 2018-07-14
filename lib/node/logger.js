"use strict";
exports.__esModule = true;
/**
 * The object used for logging and error reporting; by default using console
 * @hidden
 */
exports.logger = console;
/**
 * Enables custom logging and error reporting for state.js thereby allowing you to interface with logging / error reporting tools of your own choosing.
 * @param value The new logging and error reporting object; must have two methods, log and error that both take a string.
 * @return Returns tthe previous logging and error reporting object in use.
 */
function setLogger(value) {
    var result = exports.logger;
    exports.logger = value;
    return result;
}
exports.setLogger = setLogger;
