"use strict";
exports.__esModule = true;
var assert;
(function (assert) {
    /**
     * Tests value to see if it is truthy
     * @param value The value to test.
     * @param message A callback to create a message that will be the message of an Error exception.
     */
    function ok(value, message) {
        if (!value) {
            throw new Error(message());
        }
    }
    assert.ok = ok;
})(assert = exports.assert || (exports.assert = {}));
