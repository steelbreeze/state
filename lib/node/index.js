"use strict";
/** @module state
 *
 * A finite state machine library for TypeScript and JavaScript
 *
 * @copyright (c) 2014-8 David Mesquita-Morris
 *
 * Licensed under the MIT and GPL v3 licences
 */
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
exports.__esModule = true;
// Export the public interfaces and functions from the helpers
var logger_1 = require("./logger");
exports.setLogger = logger_1.setLogger;
var random_1 = require("./random");
exports.setRandom = random_1.setRandom;
// Export the core model enumerations and classes
var PseudoStateKind_1 = require("./PseudoStateKind");
exports.PseudoStateKind = PseudoStateKind_1.PseudoStateKind;
var TransitionKind_1 = require("./TransitionKind");
exports.TransitionKind = TransitionKind_1.TransitionKind;
__export(require("./state"));
