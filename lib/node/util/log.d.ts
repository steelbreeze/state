export declare namespace log {
    const Create: number;
    const Entry: number;
    const Exit: number;
    const Evaluate: number;
    const Transition: number;
    const Transaction: number;
    const User: number;
    const All: number;
    /**
     * Registers a callback used to log information log messages.
     * @param callback A function that takes a single string representing the informational message.
     * @param category A mask representing the types of message to log using the callback.
     * @returns Returns the id of the callback so it can later be cancelled using unsetInfo.
     */
    function add(callback: (message: string) => void, category?: number): number;
    function remove(ref: number): void;
    function info(producer: () => string, category: number): void;
}
