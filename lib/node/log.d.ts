export declare namespace log {
    const Create = 1;
    const Entry = 2;
    const Exit = 4;
    const Evaluate = 8;
    const Transition = 16;
    const Transaction = 32;
    const User = 64;
    function add(consumer: (message: string) => any, category: number): number;
    function remove(index: number): void;
    function write(producer: () => string, category: number): void;
}
