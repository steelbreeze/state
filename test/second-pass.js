"use strict";
exports.__esModule = true;
var state = require("../lib/node/state");
//var log = require("../lib/node/log");

// send log messages, warnings and errors to the console
//log.setLogger(console);

// States
const model = new state.StateMachine("model");
const initial = new state.PseudoState("initial", model, state.PseudoStateKind.Initial);
const identify = new state.State("identify", model);
const exception_1 = new state.State("exception_1", model);
const model_pass = new state.State("model_pass", model);
const model_fail = new state.State("model_fail", model);

const A = new state.State("A", model);
const A_initial = new state.PseudoState("A_initial", A, state.PseudoStateKind.Initial);
const A_1 = new state.State("A_1", A);
const A_2 = new state.State("A_2", A);
const A_3 = new state.State("A_3", A);
const A_4 = new state.State("A_4", A);
const A_pass = new state.State("A_pass", A);
const A_fail = new state.State("A_fail", A);

// Transitions
initial.to(identify);
identify.to(exception_1).when((instance, message) => message === "Continue");

exception_1.to(identify).when((instance, message) => message === "Yes");
exception_1.to(A).when((instance, message) => message === "No");
exception_1.to(model_fail).when((instance, message) => message === "Unsure");

A_initial.to(A_1);

A_1.to(A_2).when((instance, message) => message === "Yes");
A_1.to(A_fail).when((instance, message) => /No|Unsure/.test(message));

A_2.to(A_pass).when((instance, message) => message === "Yes");
A_2.to(A_3).when((instance, message) => message === "No");
A_2.to(A_fail).when((instance, message) => message === "Unsure");

A_3.to(A_pass).when((instance, message) => message === "Yes");
A_3.to(A_4).when((instance, message) => message === "No");
A_3.to(A_fail).when((instance, message) => message === "Unsure");

A_4.to(A_pass).when((instance, message) => message === "Yes");
A_4.to(A_fail).when((instance, message) => /No|Unsure/.test(message));

A_pass.to(model_pass);
A_fail.to(model_fail);

model_pass.to(identify);
model_fail.to(identify);

var instance = new state.JSONInstance("instance");
model.initialise(instance);

// Transitions
model.evaluate(instance, "Continue");
model.evaluate(instance, "No", "first time");
model.evaluate(instance, "Yes");
model.evaluate(instance, "Yes");
model.evaluate(instance, "Continue");
model.evaluate(instance, "No", "second time");