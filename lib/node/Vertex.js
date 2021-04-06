"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vertex = void 0;
const _1 = require(".");
/**
 * Represents an element within a state machine model hierarchy that can be the source or target of a transition.
 * Vertices are contained within regions.
 */
class Vertex extends _1.NamedElement {
    /**
     * Creates a new instance of the vertex class.
     * @param name The name of the vertex.
     * @param parent The parent region of this vertex.
     */
    constructor(name, parent) {
        super(name, parent);
        /**
         * The transitions originating from this vertex.
         * @internal
         * @hidden
         */
        this.outgoing = [];
        if (parent) {
            parent.children.push(this);
        }
    }
    /**
     * Creates a new transition at this vertex triggered by an event of a specific type.
     * @param TTrigger The type of the triggering event; note that this can be derived from the type parameter.
     * @param type The type (class name) of the triggering event.
     * @returns Returns a new typed transition. A typed transition being one whose guard condition and behaviour will accept a parameter of the same type specified.
     */
    on(type) {
        return new _1.Transition(this).on(type);
    }
    /**
     * Creates a new transition at this vertex with a guard condition.
     * @param TTrigger The type of the triggering event.
     * @param guard The guard condition to determine if the transition should be traversed.
     * @returns Returns a new transition; if TTrigger is specified, a typed transition will be returned.
     */
    when(guard) {
        return new _1.Transition(this).when(guard);
    }
    /**
     * Creates a new transition from this vertex to the target vertex.
     * @param TTrigger The type of the triggering event that the guard will evaluate.
     * @param target The target of the transition.
     * @param kind The kind of the transition, specifying its behaviour.
     * @returns Returns a new transition; if TTrigger is specified, a typed transition will be returned.
     */
    to(target, kind = _1.TransitionKind.External) {
        if (kind === _1.TransitionKind.Internal && target !== this) {
            throw new Error(`Internal transitions must have the same source and target states.`);
        }
        return new _1.Transition(this).to(target, kind);
    }
    /**
     * Evaluates a trigger event at this vertex to determine if it will trigger an outgoing transition.
     * @param transaction The current transaction being executed.
     * @param history True if deep history semantics are in play.
     * @param trigger The trigger event.
     * @returns Returns true if one of outgoing transitions guard conditions passed.
     * @internal
     * @hidden
     */
    evaluate(transaction, history, trigger) {
        const transition = this.getTransition(trigger);
        if (transition) {
            transition.traverse(transaction, history, trigger);
            return true;
        }
        return false;
    }
    /**
     * Selects an outgoing transition from this vertex based on the trigger event.
     * @param trigger The trigger event.
     * @returns Returns a transition or undefined if none were found.
     * @internal
     * @hidden
     */
    getTransition(trigger) {
        return this.outgoing.find(transition => transition.evaluate(trigger));
    }
    /**
     * Performs the initial steps required to enter a vertex during a state transition; updates teh active state configuration.
     * @param transaction The current transaction being executed.
     * @param history Flag used to denote deep history semantics are in force at the time of entry.
     * @param trigger The event that triggered the state transition.
     * @internal
     * @hidden
     */
    doEnterHead(transaction, history, trigger, next) {
        super.doEnterHead(transaction, history, trigger, next);
        transaction.setVertex(this);
    }
}
exports.Vertex = Vertex;
