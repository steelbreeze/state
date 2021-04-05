"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExternalTransitionStrategy = void 0;
const _1 = require(".");
/**
 * Logic used to traverse external transitions.
 */
class ExternalTransitionStrategy {
    constructor(source, target) {
        const sourceAncestors = ancestry(source);
        const targetAncestors = ancestry(target);
        let prevSource = sourceAncestors.next();
        let prevTarget = targetAncestors.next();
        let nextSource = sourceAncestors.next();
        let nextTarget = targetAncestors.next();
        while (prevSource.value === prevTarget.value && !nextSource.done && !nextTarget.done) {
            prevSource = nextSource;
            prevTarget = nextTarget;
            nextSource = sourceAncestors.next();
            nextTarget = targetAncestors.next();
        }
        this.toExit = prevSource.value;
        this.toEnter = [prevTarget.value];
        while (!nextTarget.done) {
            this.toEnter.push(nextTarget.value);
            nextTarget = targetAncestors.next();
        }
        if (target instanceof _1.PseudoState && target.isHistory) {
            this.toEnter.pop();
        }
    }
    doExitSource(transaction, history, trigger) {
        this.toExit.doExit(transaction, history, trigger);
    }
    doEnterTarget(transaction, history, trigger) {
        this.toEnter.forEach((element, index) => element.doEnterHead(transaction, history, trigger, this.toEnter[index + 1]));
        this.toEnter[this.toEnter.length - 1].doEnterTail(transaction, history, trigger);
    }
    toString() {
        return "external";
    }
}
exports.ExternalTransitionStrategy = ExternalTransitionStrategy;
/**
 * Returns the ancestry of this element from the root element of the hierarchy to this element.
 * @returns Returns an iterable iterator used to process the ancestors.
 * @internal
 * @hidden
 */
function* ancestry(element) {
    if (element.parent) {
        yield* ancestry(element.parent);
    }
    yield element;
}
