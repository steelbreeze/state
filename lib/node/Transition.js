"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transition = void 0;
const _1 = require(".");
const ExternalTransitionStrategy_1 = require("./ExternalTransitionStrategy");
const InternalTransitionStrategy_1 = require("./InternalTransitionStrategy");
const LocalTransitionStrategy_1 = require("./LocalTransitionStrategy");
/**
 * A transition changes the active state configuration of a state machine by specifying the valid transitions between states and the trigger events that cause them to be traversed.
 * @param TTrigger The type of trigger event that this transition will respond to.
 */
class Transition {
    /**
     * Creates a new instance of the Transition class. By defaily, this is an internal transition.
     * @param source The source vertex of the transition.
     * @internal
     * @hidden
     */
    constructor(source) {
        this.source = source;
        /**
         * The optional guard condition that can further restrict the transition being traversed.
         * @internal
         * @hidden
         */
        this.guard = () => true;
        /**
         * The user defined actions that will be called on transition traversal.
         * @internal
         * @hidden
         */
        this.traverseActions = [];
        this.target = source;
        this.strategy = new InternalTransitionStrategy_1.InternalTransitionStrategy(this.target);
        this.source.outgoing.push(this);
    }
    /**
     * Adds an event type constraint to the transition; it will only be traversed if a trigger event of this type is evaluated.
     * @param eventType The type of trigger event that will cause this transition to be traversed.
     * @return Returns the transitions thereby allowing a fluent style transition construction.
     */
    on(eventType) {
        this.eventType = eventType;
        return this;
    }
    /**
     * Adds an guard condition to the transition; it will only be traversed if the guard condition evaluates true for a given trigger event.
     * @param guard A boolean predicate callback that takes the trigger event as a parameter.
     * @return Returns the transitions thereby allowing a fluent style transition construction.
     * @remarks It is recommended that this is used in conjunction with the on method, which will first test the type of the trigger event.
     */
    when(guard) {
        this.guard = guard;
        return this;
    }
    /**
     * Specifies a target vertex of the transition and the semantics of the transition.
     * @param target The target vertex of the transition.
     * @param kind The kind of transition, defining the precise semantics of how the transition will impact the active state configuration.
     * @return Returns the transitions thereby allowing a fluent style transition construction.
     */
    to(target, kind = _1.TransitionKind.External) {
        this.target = target;
        if (kind === _1.TransitionKind.External) {
            this.strategy = new ExternalTransitionStrategy_1.ExternalTransitionStrategy(this.source, this.target);
        }
        else {
            this.strategy = new LocalTransitionStrategy_1.LocalTransitionStrategy(this.target);
        }
        return this;
    }
    /**
     * Adds user-defined behaviour to the transition that will be called after the source vertex has been exited and before the target vertex is entered.
     * @param actions The action, or actions to call with the trigger event as a parameter.
     * @return Returns the transitions thereby allowing a fluent style transition construction.
     */
    effect(...actions) {
        this.traverseActions.push(...actions);
        return this;
    }
    /**
     * Tests the trigger event against both the event type constraint and guard condition if specified.
     * @param trigger The trigger event.
     * @returns Returns true if the trigger event was of the event type and the guard condition passed if specified.
     * @internal
     * @hidden
     */
    evaluate(trigger) {
        return (this.eventType === undefined || trigger.constructor === this.eventType) && this.guard(trigger);
    }
    /**
     * Traverses a composite transition.
     * @param transaction The current transaction being executed.
     * @param deepHistory True if deep history semantics are in play.
     * @param trigger The trigger event.
     * @internal
     * @hidden
     */
    traverse(transaction, deepHistory, trigger) {
        var transition = this;
        const transitions = [transition];
        while (transition.target instanceof _1.PseudoState && transition.target.kind === _1.PseudoStateKind.Junction) {
            transitions.push(transition = transition.target.getTransition(trigger));
        }
        transitions.forEach(t => t.execute(transaction, deepHistory, trigger));
    }
    /**
     * Traverses an individual transition.
     * @param transaction The current transaction being executed.
     * @param deepHistory True if deep history semantics are in play.
     * @param trigger The trigger event.
     * @internal
     * @hidden
     */
    execute(transaction, deepHistory, trigger) {
        _1.log.write(() => `${transaction.instance} traverse ${this}`, _1.log.Transition);
        this.strategy.doExitSource(transaction, deepHistory, trigger);
        this.traverseActions.forEach(action => action(trigger, transaction.instance));
        this.strategy.doEnterTarget(transaction, deepHistory, trigger);
    }
    /**
     * Returns the transition in string form.
     */
    toString() {
        return `${this.strategy} transition from ${this.source} to ${this.target}`;
    }
}
exports.Transition = Transition;
