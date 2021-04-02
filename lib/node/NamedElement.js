"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
exports.__esModule = true;
exports.NamedElement = void 0;
var _1 = require(".");
/**
 * Represents an element within a state machine model hierarchy.
 * The model hierarchy is an arbitrary tree structure representing composite state machines.
 */
var NamedElement = /** @class */ (function () {
    /**
     * Creates a new instance of an element.
     * @param name The name of the element.
     * @param parent The parent of this element.
     */
    function NamedElement(name, parent) {
        var _this = this;
        this.name = name;
        this.qualifiedName = parent ? parent + "." + name : name;
        _1.log.write(function () { return "Created " + _this; }, _1.log.Create);
    }
    /**
     * Returns the ancestry of this element from the root element of the hierarchy to this element.
     * @returns Returns an iterable iterator used to process the ancestors.
     * @internal
     * @hidden
     */
    NamedElement.prototype.getAncestors = function () {
        var parent;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    parent = this.getParent();
                    if (!parent) return [3 /*break*/, 2];
                    return [5 /*yield**/, __values(parent.getAncestors())];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [4 /*yield*/, this];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    };
    /**
     * Enters an element during a state transition.
     * @param transaction The current transaction being executed.
     * @param history Flag used to denote deep history semantics are in force at the time of entry.
     * @param trigger The event that triggered the state transition.
     * @internal
     * @hidden
     */
    NamedElement.prototype.doEnter = function (transaction, history, trigger) {
        this.doEnterHead(transaction, history, trigger, undefined);
        this.doEnterTail(transaction, history, trigger);
    };
    /**
     * Performs the initial steps required to enter an element during a state transition.
     * @param transaction The current transaction being executed.
     * @param history Flag used to denote deep history semantics are in force at the time of entry.
     * @param trigger The event that triggered the state transition.
     * @internal
     * @hidden
     */
    NamedElement.prototype.doEnterHead = function (transaction, history, trigger, next) {
        var _this = this;
        _1.log.write(function () { return transaction.instance + " enter " + _this; }, _1.log.Entry);
    };
    /**
     * Exits an element during a state transition.
     * @param transaction The current transaction being executed.
     * @param history Flag used to denote deep history semantics are in force at the time of exit.
     * @param trigger The event that triggered the state transition.
     * @internal
     * @hidden
     */
    NamedElement.prototype.doExit = function (transaction, history, trigger) {
        var _this = this;
        _1.log.write(function () { return transaction.instance + " leave " + _this; }, _1.log.Exit);
    };
    /**
     * Returns the element in string form; the fully qualified name of the element.
     */
    NamedElement.prototype.toString = function () {
        return this.qualifiedName;
    };
    return NamedElement;
}());
exports.NamedElement = NamedElement;
