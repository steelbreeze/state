"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var state = require("../state");
var choice = state.PseudoStateKind.Choice;
var initial = state.PseudoStateKind.Initial;
console.log(state.PseudoStateKind.isInitial(choice));
console.log(state.PseudoStateKind.isInitial(initial));
