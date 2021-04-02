"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NamedElement = void 0;
const _1 = require(".");
/**
 * Represents an element within a state machine model hierarchy.
 * The model hierarchy is an arbitrary tree structure representing composite state machines.
 */
class NamedElement {
    /**
     * Creates a new instance of an element.
     * @param name The name of the element.
     * @param parent The parent of this element.
     */
    constructor(name, parent) {
        this.name = name;
        this.qualifiedName = parent ? `${parent}.${name}` : name;
        _1.log.write(() => `Created ${this}`, _1.log.Create);
    }
    /**
     * Returns the ancestry of this element from the root element of the hierarchy to this element.
     * @returns Returns an iterable iterator used to process the ancestors.
     * @internal
     * @hidden
     */
    *getAncestors() {
        const parent = this.getParent();
        if (parent) {
            yield* parent.getAncestors();
        }
        yield this;
    }
    /**
     * Enters an element during a state transition.
     * @param transaction The current transaction being executed.
     * @param history Flag used to denote deep history semantics are in force at the time of entry.
     * @param trigger The event that triggered the state transition.
     * @internal
     * @hidden
     */
    doEnter(transaction, history, trigger) {
        this.doEnterHead(transaction, history, trigger, undefined);
        this.doEnterTail(transaction, history, trigger);
    }
    /**
     * Performs the initial steps required to enter an element during a state transition.
     * @param transaction The current transaction being executed.
     * @param history Flag used to denote deep history semantics are in force at the time of entry.
     * @param trigger The event that triggered the state transition.
     * @internal
     * @hidden
     */
    doEnterHead(transaction, history, trigger, next) {
        _1.log.write(() => `${transaction.instance} enter ${this}`, _1.log.Entry);
    }
    /**
     * Exits an element during a state transition.
     * @param transaction The current transaction being executed.
     * @param history Flag used to denote deep history semantics are in force at the time of exit.
     * @param trigger The event that triggered the state transition.
     * @internal
     * @hidden
     */
    doExit(transaction, history, trigger) {
        _1.log.write(() => `${transaction.instance} leave ${this}`, _1.log.Exit);
    }
    /**
     * Returns the element in string form; the fully qualified name of the element.
     */
    toString() {
        return this.qualifiedName;
    }
}
exports.NamedElement = NamedElement;
