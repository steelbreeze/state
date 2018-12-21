"use strict";
exports.__esModule = true;
var util_1 = require("./util");
var Vertex_1 = require("./Vertex");
var Region_1 = require("./Region");
var Transition_1 = require("./Transition");
var TransitionKind_1 = require("./TransitionKind");
/**
 * A state represents a condition in a state machine that is the result of the triggers processed.
 * @public
 */
var State = /** @class */ (function () {
    /**
     * Creates a new instance of the State class.
     * @param name The name of the state.
     * @param parent The parent region of the state or a state whose default region will be used as the parent region.
     * If left undefined, this state is the root state in a state machine model.
     * @public
     */
    function State(name, parent) {
        if (parent === void 0) { parent = undefined; }
        var _this = this;
        this.name = name;
        /**
         * The outgoing transitions available from this vertex.
         */
        this.outgoing = [];
        /**
         * The child regions belonging to this state.
         * @internal
         */
        this.children = [];
        /**
         * The behaviour to each time the state is entered.
         * @internal
         */
        this.onEnter = [];
        /**
         * The behaviour to perform each time the is state exited.
         * @internal
         */
        this.onLeave = [];
        /**
         * The list of types that this state can defer to the event pool.
         * @internal
         */
        this.deferrableTrigger = [];
        this.parent = parent instanceof State ? parent.getDefaultRegion() : parent;
        if (this.parent) {
            util_1.assert.ok(!this.parent.children.filter(function (vertex) { return vertex instanceof State && vertex.name === _this.name; }).length, function () { return "State names must be unique within a region"; });
            this.qualifiedName = this.parent + "." + name;
            this.parent.children.unshift(this);
        }
        else {
            this.qualifiedName = name;
        }
        util_1.log.info(function () { return "Created state " + _this; }, util_1.log.Create);
    }
    /**
     * Returns the default state of the region; creates one if it does not already exist.
     * @returns Returns the default region.
     * @public
     */
    State.prototype.getDefaultRegion = function () {
        return this.defaultRegion || (this.defaultRegion = new Region_1.Region(this.name, this));
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
        return new Transition_1.Transition(this, undefined, TransitionKind_1.TransitionKind.internal, type);
    };
    State.prototype.when = function (guard) {
        return new Transition_1.Transition(this, undefined, TransitionKind_1.TransitionKind.internal, undefined, guard);
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
        if (kind === void 0) { kind = TransitionKind_1.TransitionKind.external; }
        return new Transition_1.Transition(this, target, kind);
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
     * Find a transition from the state given a trigger event.
     * @param trigger The trigger event to evaluate transtions against.
     * @returns Returns the trigger or undefined if none are found.
     * @throws Throws an Error if more than one transition was found.
     */
    State.prototype.getTransition = function (trigger) {
        var _this = this;
        var result;
        // iterate through all outgoing transitions of this state looking for a single one whose guard evaluates true
        for (var i = this.outgoing.length; i--;) {
            if (this.outgoing[i].evaluate(trigger)) {
                util_1.assert.ok(!result, function () { return "Multiple transitions found at " + _this + " for " + trigger; });
                result = this.outgoing[i];
            }
        }
        return result;
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
        var result = this.delegate(instance, deepHistory, trigger) || Vertex_1.accept(this, instance, deepHistory, trigger) || this.testDefer(instance, trigger);
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
    State.prototype.testDefer = function (instance, trigger) {
        var result = false;
        if (this.deferrableTrigger.indexOf(trigger.constructor) !== -1) {
            instance.defer(this, trigger);
            result = true;
        }
        return result;
    };
    State.prototype.enter = function (instance, deepHistory, trigger) {
        this.enterHead(instance, deepHistory, trigger, undefined);
        this.enterTail(instance, deepHistory, trigger);
    };
    /** Initiate state entry */
    State.prototype.enterHead = function (instance, deepHistory, trigger, nextElement) {
        var _this = this;
        // when entering a state indirectly (part of the target ancestry in a transition that crosses region boundaries), ensure all child regions are entered
        if (nextElement) {
            // enter all child regions except for the next in the ancestry
            for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
                var region = _a[_i];
                if (region !== nextElement) {
                    region.enter(instance, deepHistory, trigger);
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
        Vertex_1.accept(this, instance, deepHistory, trigger);
    };
    /**
     * Returns the fully qualified name of the state.
     * @public
     */
    State.prototype.toString = function () {
        return this.qualifiedName;
    };
    return State;
}());
exports.State = State;
