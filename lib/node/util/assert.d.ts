export declare namespace assert {
    /**
     * Assert that an object is defined
     * @param item The object to test
     * @param onUndefined A callback to create a message that will be the content of the exception thrown if the object is undefined.
     */
    function defined(item: object | undefined, onUndefined: () => string): void;
    /**
     * Assert that an object is undefined
     * @param item The object to test
     * @param onUndefined A callback to create a message that will be the content of the exception thrown if the object is defined.
     */
    function undefined(item: object | undefined, onDefined: () => string): void;
    /**
     * Assert that an object is undefined
     * @param item The object to test
     * @param onUndefined A callback to create a message that will be the content of the exception thrown if the object is defined.
     */
    function empty(array: Array<any>, onFull: () => string): void;
}
