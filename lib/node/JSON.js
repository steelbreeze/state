"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.JSONSerializer = void 0;
var _1 = require(".");
var JSONNode = /** @class */ (function () {
    function JSONNode(element) {
        this.name = element.name;
    }
    return JSONNode;
}());
var JSONState = /** @class */ (function (_super) {
    __extends(JSONState, _super);
    function JSONState() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.children = [];
        return _this;
    }
    return JSONState;
}(JSONNode));
var JSONRegion = /** @class */ (function (_super) {
    __extends(JSONRegion, _super);
    function JSONRegion(region, activeState) {
        var _this = _super.call(this, region) || this;
        _this.activeState = activeState;
        _this.children = [];
        return _this;
    }
    return JSONRegion;
}(JSONNode));
var JSONSerializer = /** @class */ (function (_super) {
    __extends(JSONSerializer, _super);
    function JSONSerializer(instance, deferedEventSerializer) {
        if (deferedEventSerializer === void 0) { deferedEventSerializer = undefined; }
        var _this = _super.call(this) || this;
        _this.instance = instance;
        _this.deferedEventSerializer = deferedEventSerializer;
        _this.stateMap = {};
        _this.regionMap = {};
        return _this;
    }
    JSONSerializer.prototype.visitState = function (state) {
        var jsonState = new JSONState(state);
        this.stateMap[state.qualifiedName] = jsonState;
        if (state.parent !== undefined) {
            this.regionMap[state.parent.qualifiedName].children.push(jsonState);
        }
        else {
            this.root = jsonState;
        }
    };
    JSONSerializer.prototype.visitRegion = function (region) {
        var lastKnownState = this.instance.getState(region);
        var jsonRegion = new JSONRegion(region, lastKnownState ? lastKnownState.name : undefined);
        this.regionMap[region.qualifiedName] = jsonRegion;
        this.stateMap[region.parent.qualifiedName].children.push(jsonRegion);
    };
    JSONSerializer.prototype.toString = function () {
        if (this.instance.deferredEventPool.length !== 0 && this.deferedEventSerializer && this.root) {
            this.root.deferredEventPool = this.instance.deferredEventPool.map(this.deferedEventSerializer);
        }
        return JSON.stringify(this.root);
    };
    return JSONSerializer;
}(_1.Visitor));
exports.JSONSerializer = JSONSerializer;
