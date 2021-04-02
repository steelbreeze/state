"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONSerializer = void 0;
const _1 = require(".");
class JSONNode {
    constructor(element) {
        this.name = element.name;
    }
}
class JSONState extends JSONNode {
    constructor() {
        super(...arguments);
        this.children = [];
    }
}
class JSONRegion extends JSONNode {
    constructor(region, activeState) {
        super(region);
        this.activeState = activeState;
        this.children = [];
    }
}
class JSONSerializer extends _1.Visitor {
    constructor(instance, deferedEventSerializer = undefined) {
        super();
        this.instance = instance;
        this.deferedEventSerializer = deferedEventSerializer;
        this.stateMap = {};
        this.regionMap = {};
    }
    visitState(state) {
        const jsonState = new JSONState(state);
        this.stateMap[state.qualifiedName] = jsonState;
        if (state.parent !== undefined) {
            this.regionMap[state.parent.qualifiedName].children.push(jsonState);
        }
        else {
            this.root = jsonState;
        }
    }
    visitRegion(region) {
        const lastKnownState = this.instance.getState(region);
        const jsonRegion = new JSONRegion(region, lastKnownState ? lastKnownState.name : undefined);
        this.regionMap[region.qualifiedName] = jsonRegion;
        this.stateMap[region.parent.qualifiedName].children.push(jsonRegion);
    }
    toString() {
        if (this.instance.deferredEventPool.length !== 0 && this.deferedEventSerializer && this.root) {
            this.root.deferredEventPool = this.instance.deferredEventPool.map(this.deferedEventSerializer);
        }
        return JSON.stringify(this.root);
    }
}
exports.JSONSerializer = JSONSerializer;
