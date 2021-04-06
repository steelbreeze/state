"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PseudoState = void 0;
const random_1 = require("./random");
const _1 = require(".");
const TransitionKind_1 = require("./TransitionKind");
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
        super(name, parent instanceof _1.State ? parent.getDefaultRegion() : parent);
        this.kind = kind;
        this.parent = parent instanceof _1.State ? parent.getDefaultRegion() : parent;
        this.parent.children.push(this);
        this.isHistory = this.kind === _1.PseudoStateKind.DeepHistory || this.kind === _1.PseudoStateKind.ShallowHistory;
        if (this.kind === _1.PseudoStateKind.Initial || this.isHistory) {
            this.parent.initial = this;
        }
    }
    /**
     * Creates an 'else' transition from this pseudo state, which will be chosen if no other outgoing transition is found.
     * @param target The target of the transition.
     * @param kind The kind of the transition, specifying its behaviour.
     * @returns Returns a new untyped transition.
     */
    else(target, kind = TransitionKind_1.TransitionKind.External) {
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
        const transition = this.kind === _1.PseudoStateKind.Choice ? random_1.random.get(this.outgoing.filter(transition => transition.evaluate(trigger))) : super.getTransition(trigger);
        return transition || this.elseTransition;
    }
    /**
     * Immediately exits the pseudo state on entry; note that for junction pseudo states, this is managed in Transition.traverse
     * @param transaction The current transaction being executed.
     * @param history Flag used to denote deep history semantics are in force at the time of entry.
     * @param trigger The event that triggered the state transition.
     * @internal
     * @hidden
     */
    doEnterTail(transaction, history, trigger) {
        if (this.kind !== _1.PseudoStateKind.Junction) {
            this.evaluate(transaction, history, trigger);
        }
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
