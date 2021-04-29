"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PseudoState = void 0;
const _1 = require(".");
const random_1 = require("./random");
/**
 * A pseudo state is a transient state within a region, once entered it will exit immediately.
 */
class PseudoState extends _1.Vertex {
    /**
     * Creates a new instance of the PseudoState class.
     * @param name The name of the pseudo state.
     * @param parent The parent region of the pseudo state; note that a state can also be used, in which case the default region of the state will become the pseudo states parent.
     * @param kind The kind pseudo state which defines its behaviour and use.
     */
    constructor(name, parent, kind = _1.PseudoStateKind.Initial) {
        super(name);
        this.kind = kind;
        this.parent = parent instanceof _1.State ? parent.getDefaultRegion() : parent;
        if (this.kind & _1.PseudoStateKind.Starting) {
            this.parent.initial = this;
        }
    }
    /**
     * Creates an 'else' transition from this pseudo state, which will be chosen if no other outgoing transition is found.
     * @param target The target of the transition.
     * @param kind The kind of the transition, specifying its behaviour.
     * @returns Returns a new untyped transition.
     */
    else(target, kind = _1.TransitionKind.External) {
        return this.elseTransition = new _1.Transition(this).to(target, kind).when(() => false);
    }
    /**
     * Selects an outgoing transition from this pseudo state based on the trigger event.
     * @param trigger The trigger event.
     * @returns Returns a transition or undefined if none were found.
     * @internal
     * @hidden
     */
    getTransition(trigger) {
        const transition = this.kind & _1.PseudoStateKind.Choice ? random_1.random(this.outgoing.filter(transition => transition.evaluate(trigger))) : super.getTransition(trigger);
        return transition || this.elseTransition;
    }
    /**
     * Enters an element during a state transition.
     * @param transaction The current transaction being executed.
     * @param deepHistory Flag used to denote deep history semantics are in force at the time of entry.
     * @param trigger The event that triggered the state transition.
     * @param next The next element to enter in a non-cascaded entry, driven by external transitions.
     * @internal
     * @hidden
     */
    doEnter(transaction, deepHistory, trigger, next) {
        _1.log.write(() => `${transaction.instance} enter ${this}`, _1.log.Entry);
        transaction.setVertex(this);
        if (!next && !(this.kind & _1.PseudoStateKind.Junction)) {
            this.evaluate(transaction, deepHistory, trigger);
        }
    }
    /**
     * Exits a state during a state transition.
     * @param transaction The current transaction being executed.
     * @internal
     * @hidden
     */
    doExit(transaction) {
        _1.log.write(() => `${transaction.instance} leave ${this}`, _1.log.Exit);
    }
    /**
     * Accepts a visitor and calls back its visitPseudoState method.
     * @param visitor The visitor to call back.
     */
    accept(visitor) {
        visitor.visitPseudoState(this);
        visitor.visitPseudoStateTail(this);
    }
}
exports.PseudoState = PseudoState;
