export namespace assert {
	/**
	 * Assert that an object is defined
	 * @param item The object to test
	 * @param onUndefined A callback to create a message that will be the content of the exception thrown if the object is undefined.
	 */
	export function defined(item: object | undefined, onUndefined: () => string): void {
		if (!item) {
			throw new Error(onUndefined());
		}
	}

	/**
	 * Assert that an object is undefined
	 * @param item The object to test
	 * @param onUndefined A callback to create a message that will be the content of the exception thrown if the object is defined.
	 */
	export function undefined(item: object | undefined, onDefined: () => string): void {
		if (item) {
			throw new Error(onDefined());
		}
	}

	/**
	 * Assert that an object is undefined
	 * @param item The object to test
	 * @param onUndefined A callback to create a message that will be the content of the exception thrown if the object is defined.
	 */
	export function empty(array: Array<any>, onFull: () => string): void {
		if (array.length !== 0) {
			throw new Error(onFull());
		}
	}
}