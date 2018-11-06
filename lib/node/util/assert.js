"use strict";
exports.__esModule = true;
var assert;
(function (assert) {
    /**
     * Assert that an object is defined
     * @param item The object to test
     * @param onUndefined A callback to create a message that will be the content of the exception thrown if the object is undefined.
     */
    function defined(item, onUndefined) {
        if (!item) {
            throw new Error(onUndefined());
        }
    }
    assert.defined = defined;
    /**
     * Assert that an object is undefined
     * @param item The object to test
     * @param onUndefined A callback to create a message that will be the content of the exception thrown if the object is defined.
     */
    function undefined(item, onDefined) {
        if (item) {
            throw new Error(onDefined());
        }
    }
    assert.undefined = undefined;
})(assert = exports.assert || (exports.assert = {}));
