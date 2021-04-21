"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONSerializer = void 0;
class JSONNode {
    constructor(element) {
        this.name = element.name;
    }
}
class JSONState extends JSONNode {
    constructor(state) {
        super(state);
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
class JSONSerializer {
    constructor(instance, deferedEventSerializer = undefined) {
        this.instance = instance;
        this.deferedEventSerializer = deferedEventSerializer;
        this.stateMap = new Map();
        this.regionMap = new Map();
    }
    visitPseudoState(pseduoState) {
    }
    visitPseudoStateTail(pseduoState) {
    }
    visitState(state) {
        const jsonState = new JSONState(state);
        this.stateMap.set(state, jsonState);
        if (state.parent) {
            const parent = this.regionMap.get(state.parent);
            if (parent) {
                parent.children.push(jsonState);
            }
        }
        else {
            this.root = jsonState;
        }
    }
    visitStateTail(state) {
    }
    visitRegion(region) {
        const lastKnownState = this.instance.get(region);
        const jsonRegion = new JSONRegion(region, lastKnownState ? lastKnownState.name : undefined);
        this.regionMap.set(region, jsonRegion);
        const parent = this.stateMap.get(region.parent);
        if (parent) {
            parent.children.push(jsonRegion);
        }
    }
    visitRegionTail(region) {
    }
    toString() {
        if (this.instance.deferredEventPool.length && this.deferedEventSerializer && this.root) {
            this.root.deferredEventPool = this.instance.deferredEventPool.map(this.deferedEventSerializer);
        }
        return JSON.stringify(this.root);
    }
}
exports.JSONSerializer = JSONSerializer;
