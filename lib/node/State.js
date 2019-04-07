"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
exports.__esModule = true;
var _1 = require(".");
/**
 * A state is a situation in the lifecycle of the state machine that is stable between events.
 */
var State = /** @class */ (function (_super) {
    __extends(State, _super);
    /**
     * Creates a new instance of the state class.
     * @param name The name of the state.
     * @param parent The parent region of the state; note that another state can also be used, in which case the default region of the state will become this states parent. If parent is left undefined, then this state is the root of the state machine hierarchy.
     */
    function State(name, parent) {
        if (parent === void 0) { parent = undefined; }
        var _this = _super.call(this, name, parent instanceof State ? parent.getDefaultRegion() : parent) || this;
        /**
         * The child regions of the state.
         * @internal
         * @hidden
         */
        _this.children = [];
        /**
         * The types of events that may be deferred while in this state.
         */
        _this.deferrableTriggers = [];
        /**
         * The user-defined actions that will be called upon state entry.
         */
        _this.entryActions = [];
        /**
         * The user-defined actions that will be called upon state exit.
         */
        _this.exitActions = [];
        return _this;
    }
    /**
     * Adds a user-defined behaviour to call on state entry.
     * @param actions One or callbacks that will be passed the trigger event.
     * @return Returns the state thereby allowing a fluent style state construction.
     */
    State.prototype.entry = function () {
        var _a;
        var actions = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            actions[_i] = arguments[_i];
        }
        (_a = this.entryActions).push.apply(_a, __spread(actions));
        return this;
    };
    /**
     * Adds a user-defined behaviour to call on state exit.
     * @param actions One or callbacks that will be passed the trigger event.
     * @return Returns the state thereby allowing a fluent style state construction.
     */
    State.prototype.exit = function () {
        var _a;
        var actions = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            actions[_i] = arguments[_i];
        }
        (_a = this.exitActions).push.apply(_a, __spread(actions));
        return this;
    };
    /**
     * Adds the types of trigger event that can .
     * @param actions One or callbacks that will be passed the trigger event.
     * @return Returns the state thereby allowing a fluent style state construction.
     */
    State.prototype.defer = function () {
        var _a;
        var type = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            type[_i] = arguments[_i];
        }
        (_a = this.deferrableTriggers).push.apply(_a, __spread(type));
        return this;
    };
    /**
     * Returns the default region for state and creates it if required; as used in the implicit creation of vertices.
     * @returns The default state.
     * @internal
     * @hidden
     */
    State.prototype.getDefaultRegion = function () {
        return this.defaultRegion || (this.defaultRegion = new _1.Region("default", this));
    };
    /**
     * Tests a state to see if it is a simple state, one without and child regions.
     * @returns Returns true if the state is a simple state.
     */
    State.prototype.isSimple = function () {
        return this.children.length === 0;
    };
    /**
     * Tests a state to see if it is a composite state, one with one or more child regions.
     * @returns Returns true if the state is a composite state.
     */
    State.prototype.isComposite = function () {
        return this.children.length > 0;
    };
    /**
     * Tests a state to see if it is an orthogonal state, one with two or more child regions.
     * @returns Returns true if the state is an orthogonal state.
     */
    State.prototype.isOrthogonal = function () {
        return this.children.length > 1;
    };
    /**
     * Tests a state to see if it is a final state, one without outgoing transitions.
     * @returns Returns true if the state is a final state.
     */
    State.prototype.isFinal = function () {
        return this.outgoing.length === 0;
    };
    /**
     * Tests a state machine instance to see if this state is complete.
     * A state is complete if it is a simple state, or if composite, all its child regions are complete.
     * @returns Returns true if the state machine instance is complete for this state.
     * @internal
     * @hidden
     */
    State.prototype.isComplete = function (instance) {
        return !this.children.some(function (region) { return !region.isComplete(instance); });
    };
    /**
     * Evaluates a trigger event at this state to determine if it will trigger an outgoing transition.
     * @param instance The state machine instance.
     * @param history True if deep history semantics are in play.
     * @param trigger The trigger event.
     * @returns Returns true if one of outgoing transitions guard conditions passed.
     * @remarks Prior to evaluating the trigger against the outcoing transitions, it delegates the trigger to children for evaluation thereby implementing depth-first evaluation of trigger events.
     * @internal
     * @hidden
     */
    State.prototype.evaluate = function (instance, history, trigger) {
        var result = this.delegate(instance, history, trigger) || _super.prototype.evaluate.call(this, instance, history, trigger) || this.deferrable(instance, trigger);
        if (result) {
            this.completion(instance, history);
        }
        return result;
    };
    /**
     * Delegates a trigger event to the children of this state to determine if it will trigger an outgoing transition.
     * @param instance The state machine instance.
     * @param history True if deep history semantics are in play.
     * @param trigger The trigger event.
     * @returns Returns true if a child state processed the trigger.
     * @internal
     * @hidden
     */
    State.prototype.delegate = function (instance, history, trigger) {
        var e_1, _a;
        var result = false;
        try {
            for (var _b = __values(this.children), _c = _b.next(); !_c.done; _c = _b.next()) {
                var region = _c.value;
                if (instance.getState(region).evaluate(instance, history, trigger)) {
                    result = true;
                    if (this.parent && instance.getState(this.parent) !== this) {
                        break;
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return result;
    };
    /**
     * Tests the trigger event to see if it can be deferred from this state.
     * @param instance The state machine instance.
     * @param trigger The trigger event.
     * @returns Returns true if the type of the trigger event matched one of the user defined deferrable event types.
     * @internal
     * @hidden
     */
    State.prototype.deferrable = function (instance, trigger) {
        if (this.deferrableTriggers.indexOf(trigger.constructor) !== -1) {
            instance.defer(trigger);
            return true;
        }
        return false;
    };
    /**
     * Returns the list of deferable event types from the current active state configuration.
     * @param instance The state machine instance.
     * @returns Returns an array of the deferable event types from the current active state configuration.
     * @internal
     * @hidden
     */
    State.prototype.getDeferrableTriggers = function (instance) {
        return this.children.reduce(function (result, region) { return result.concat(instance.getState(region).getDeferrableTriggers(instance)); }, this.deferrableTriggers);
    };
    /**
     * Performs the initial steps required to enter a state during a state transition; updates teh active state configuration.
     * @param instance The state machine instance that is entering the element.
     * @param history Flag used to denote deep history semantics are in force at the time of entry.
     * @param trigger The event that triggered the state transition.
     * @internal
     * @hidden
     */
    State.prototype.doEnterHead = function (instance, history, trigger, next) {
        if (next) {
            this.children.forEach(function (region) {
                if (region !== next) {
                    region.doEnter(instance, history, trigger);
                }
            });
        }
        _super.prototype.doEnterHead.call(this, instance, history, trigger, next);
        this.entryActions.forEach(function (action) { return action(trigger); });
    };
    /**
     * Performs the final steps required to enter a state during a state transition including cascading the entry operation to child elements and completion transition.
     * @param instance The state machine instance that is entering the element.
     * @param history Flag used to denote deep history semantics are in force at the time of entry.
     * @param trigger The event that triggered the state transition.
     * @internal
     * @hidden
     */
    State.prototype.doEnterTail = function (instance, history, trigger) {
        this.children.forEach(function (region) { return region.doEnter(instance, history, trigger); });
        this.completion(instance, history);
    };
    /**
     * Exits a state during a state transition.
     * @param instance The state machine instance that is exiting the element.
     * @param history Flag used to denote deep history semantics are in force at the time of exit.
     * @param trigger The event that triggered the state transition.
     * @internal
     * @hidden
     */
    State.prototype.doExit = function (instance, history, trigger) {
        this.children.forEach(function (region) { return region.doExit(instance, history, trigger); });
        _super.prototype.doExit.call(this, instance, history, trigger);
        this.exitActions.forEach(function (action) { return action(trigger); });
    };
    /**
     * Evaluates completion transitions at the state.
     * @param instance The state machine instance that is exiting the element.
     * @param history Flag used to denote deep history semantics are in force at the time of exit.
     * @internal
     * @hidden
     */
    State.prototype.completion = function (instance, history) {
        if (this.isComplete(instance)) {
            _super.prototype.evaluate.call(this, instance, history, this);
        }
    };
    /**
     * Accepts a visitor and calls visitor.visitStateHead method, cascades to child regions then calls the visitor.visitStateTail.
     * @param visitor The visitor to call back.
     */
    State.prototype.accept = function (visitor) {
        var e_2, _a;
        visitor.visitStateHead(this);
        try {
            for (var _b = __values(this.children), _c = _b.next(); !_c.done; _c = _b.next()) {
                var region = _c.value;
                region.accept(visitor);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        visitor.visitStateTail(this);
    };
    return State;
}(_1.Vertex));
exports.State = State;
