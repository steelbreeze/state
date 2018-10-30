"use strict";
exports.__esModule = true;
/**
 * The default implementation of a state machine instance using associative arrays as the storage mechanism.
 */
var Instance_1 = require("./Instance");
exports.Instance = Instance_1.Instance;
var core_1 = require("./core");
exports.initialise = core_1.initialise;
exports.evaluate = core_1.evaluate;
