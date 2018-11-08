"use strict";
exports.__esModule = true;
var util_1 = require("../util");
var Region_1 = require("./Region");
var ExternalTransition_1 = require("./ExternalTransition");
var LocalTransition_1 = require("./LocalTransition");
var InternalTransition_1 = require("./InternalTransition");
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
        this.parent = parent instanceof State ? parent.getDefaultRegion() : parent;
        if (this.parent) {
            util_1.assert.ok(!this.parent.children.filter(function (vertex) { return vertex instanceof State && vertex.name === _this.name; }).length, function () { return "State names must be unique within a region"; });
            this.qualifiedName = this.parent + "." + name;
            this.parent.children.unshift(this);
        }
        else {
            this.qualifiedName = name;
        }
        util_1.log.info(function () { return "Created " + _this; }, util_1.log.Create);
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
     * Creates a new external transition.
     * @param target The target vertex of the external transition.
     * @returns The external transition.
     * @public
     */
    State.prototype.external = function (target) {
        return new ExternalTransition_1.ExternalTransition(this, target);
    };
    /**
     * Creates a new external transition.
     * @param target The target vertex of the external transition.
     * @returns If target is specified, returns an external transition otherwide an internal transition.
     * @public
     * @deprecated
     */
    State.prototype.to = function (target) {
        return target ? this.external(target) : this.internal();
    };
    /**
     * Creates a new internal transition.
     * @returns Returns the internal transition.
     * @public
     */
    State.prototype.internal = function () {
        return new InternalTransition_1.InternalTransition(this);
    };
    /**
     * Creates a new local transition.
     * @param target The target vertex of the local transition.
     * @returns Returns the local transition.
     * @public
     */
    State.prototype.local = function (target) {
        return new LocalTransition_1.LocalTransition(this, target);
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
