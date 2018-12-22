"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var util_1 = require("./util");
var Vertex_1 = require("./Vertex");
var index_1 = require("./index");
/**
 * A state represents a condition in a state machine that is the result of the triggers processed.
 * @public
 */
var State = /** @class */ (function (_super) {
    __extends(State, _super);
    /**
     * Creates a new instance of the State class.
     * @param name The name of the state.
     * @param parent The parent region of the state or a state whose default region will be used as the parent region.
     * If left undefined, this state is the root state in a state machine model.
     * @public
     */
    function State(name, parent) {
        if (parent === void 0) { parent = undefined; }
        var _this = _super.call(this, name, parent) || this;
        _this.name = name;
        /**
         * The child regions belonging to this state.
         * @internal
         */
        _this.children = [];
        /**
         * The behaviour to each time the state is entered.
         * @internal
         */
        _this.onEnter = [];
        /**
         * The behaviour to perform each time the is state exited.
         * @internal
         */
        _this.onLeave = [];
        /**
         * The list of types that this state can defer to the event pool.
         * @internal
         */
        _this.deferrableTrigger = [];
        return _this;
    }
    /**
     * Returns the default state of the region; creates one if it does not already exist.
     * @returns Returns the default region.
     * @public
     */
    State.prototype.getDefaultRegion = function () {
        return this.defaultRegion || (this.defaultRegion = new index_1.Region(this.name, this));
    };
    /**
     * Tests the state to see if it is a simple state (having no child regions).
     * @returns True if the state has no child regions.
     * @public
     */
    State.prototype.isSimple = function () {
        return this.children.length === 0;
    };
    /**
     * Tests the state to see if it is a composite state (having one or more child regions).
     * @returns True if the state has one or more child regions.
     * @public
     */
    State.prototype.isComposite = function () {
        return this.children.length >= 1;
    };
    /**
     * Tests the state to see if it is a composite state (having two or more child regions).
     * @returns True if the state has two or more child regions.
     * @public
     */
    State.prototype.isOrthogonal = function () {
        return this.children.length >= 2;
    };
    /**
     * Returns true if the state is a final state. A final state is one that has no outgoing transitions therefore no more state transitions can occur in it's parent region.
     */
    State.prototype.isFinal = function () {
        return this.outgoing.length === 0;
    };
    /**
     * Adds behaviour to the state to be called every time the state is entered.
     * @param action The behaviour to call on state entry.
     * @returns Returns the state.
     * @public
     */
    State.prototype.entry = function (action) {
        this.onEnter.unshift(action); // NOTE: we use unshift as the runtime iterates in reverse
        return this;
    };
    /**
     * Adds behaviour to the state to be called every time the state is exited.
     * @param action The behaviour to call on state exit.
     * @returns Returns the state.
     * @public
     */
    State.prototype.exit = function (action) {
        this.onLeave.unshift(action); // NOTE: we use unshift as the runtime iterates in reverse
        return this;
    };
    /**
     * Creates a new transition with a type test.
     * @remarks Once creates with the [[State.on]] method, the transition can be enhanced using the fluent API calls of [[Transition.if]], [[Transition.to]]/[[Transition.local]] and [[Transition.do]].
     * @param type The type of event that this transition will look for.
     * @returns Returns the newly created transition.
     * @public
     */
    State.prototype.on = function (type) {
        return new index_1.Transition(this, undefined, index_1.TransitionKind.internal, type);
    };
    State.prototype.when = function (guard) {
        return new index_1.Transition(this, undefined, index_1.TransitionKind.internal, undefined, guard);
    };
    /**
     * Creates a new external transition.
     * @param TTrigger The type of the trigger event that may cause the transition to be traversed.
     * @param target The target vertex of the external transition.
     * @param kind The kind of transition, defaults to external, but can also be local.
     * @returns If target is specified, returns an external transition otherwide an internal transition.
     * @public
     */
    State.prototype.to = function (target, kind) {
        if (kind === void 0) { kind = index_1.TransitionKind.external; }
        return new index_1.Transition(this, target, kind);
    };
    /**
     * Marks a particular type of event for deferral if it is not processed by the state. Deferred events are placed in the event pool for subsiquent evaluation.
     * @param type The type of event that this state will defer.
     * @returns Returns the state.
     * @public
     */
    State.prototype.defer = function (type) {
        this.deferrableTrigger.unshift(type);
        return this;
    };
    /**
     * Passes a trigger event to a state machine instance for evaluation
     * @param state The state to evaluate the trigger event against.
     * @param instance The state machine instance to evaluate the trigger against.
     * @param deepHistory True if deep history semantics are invoked.
     * @param trigger The trigger event
     * @returns Returns true if the trigger was consumed by the state.
     * @hidden
     */
    State.prototype.evaluate = function (instance, deepHistory, trigger) {
        var result = this.delegate(instance, deepHistory, trigger) || this.accept(instance, deepHistory, trigger) || this.deferTrigger(instance, trigger);
        // check completion transitions if the trigger caused as state transition and this state is still active
        if (result && this.parent && instance.getState(this.parent) === this) {
            this.completion(instance, deepHistory, this);
        }
        return result;
    };
    /** Delegate a trigger to children for evaluation */
    State.prototype.delegate = function (instance, deepHistory, trigger) {
        var result = false;
        // delegate to the current state of child regions for evaluation
        for (var i = this.children.length; i--;) {
            if (instance.getState(this.children[i]).evaluate(instance, deepHistory, trigger)) {
                result = true;
                // if a transition in a child state causes us to exit this state, break out now 
                if (this.parent && instance.getState(this.parent) !== this) {
                    break;
                }
            }
        }
        return result;
    };
    /** Evaluates the trigger event against the list of deferred transitions and defers into the event pool if necessary. */
    State.prototype.deferTrigger = function (instance, trigger) {
        var result = false;
        if (this.deferrableTrigger.indexOf(trigger.constructor) !== -1) {
            instance.defer(this, trigger);
            result = true;
        }
        return result;
    };
    /** Initiate state entry */
    State.prototype.enterHead = function (instance, deepHistory, trigger, nextElement) {
        var _this = this;
        // when entering a state indirectly (part of the target ancestry in a transition that crosses region boundaries), ensure all child regions are entered
        if (nextElement) {
            // enter all child regions except for the next in the ancestry
            for (var i = this.children.length; i--;) {
                if (this.children[i] !== nextElement) {
                    this.children[i].enter(instance, deepHistory, trigger);
                }
            }
        }
        util_1.log.info(function () { return instance + " enter " + _this; }, util_1.log.Entry);
        // update the current state and vertex of the parent region
        instance.setState(this);
        // perform the user defined entry behaviour
        for (var i = this.onEnter.length; i--;) {
            this.onEnter[i](trigger);
        }
    };
    /** Complete state entry */
    State.prototype.enterTail = function (instance, deepHistory, trigger) {
        // cascade the enter operation to child regions
        for (var i = this.children.length; i--;) {
            this.children[i].enter(instance, deepHistory, trigger);
        }
        // test for completion transitions
        this.completion(instance, deepHistory, this);
    };
    /** Leave a state */
    State.prototype.leave = function (instance, deepHistory, trigger) {
        var _this = this;
        // cascade the leave operation to all child regions
        for (var i = this.children.length; i--;) {
            this.children[i].leave(instance, deepHistory, trigger);
        }
        util_1.log.info(function () { return instance + " leave " + _this; }, util_1.log.Exit);
        // perform the user defined leave behaviour
        for (var i_1 = this.onLeave.length; i_1--;) {
            this.onLeave[i_1](trigger);
        }
    };
    /** Checks for and executes completion transitions */
    State.prototype.completion = function (instance, deepHistory, trigger) {
        // check to see if the state is complete; fail fast if its not
        for (var i = this.children.length; i--;) {
            if (!instance.getState(this.children[i]).isFinal()) {
                return;
            }
        }
        // look for transitions
        this.accept(instance, deepHistory, trigger);
    };
    return State;
}(Vertex_1.Vertex));
exports.State = State;
