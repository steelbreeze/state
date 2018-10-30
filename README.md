# state
Executable finite state machine for TypeScript and JavaScript.

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][npm-url]
[![Build Status](https://travis-ci.org/steelbreeze/state.svg?branch=master)](https://travis-ci.org/steelbreeze/state)
[![Code Climate](https://codeclimate.com/github/steelbreeze/state/badges/gpa.svg)](https://codeclimate.com/github/steelbreeze/state)
[![Issue Count](https://codeclimate.com/github/steelbreeze/state/badges/issue_count.svg)](https://codeclimate.com/github/steelbreeze/state)
[![Test Coverage](https://codeclimate.com/github/steelbreeze/state/badges/coverage.svg)](https://codeclimate.com/github/steelbreeze/state/coverage)


> **Notes:**
>
>v7.0.0 is in the works and contains significant breaking changes but offers vry considerable performance improvements. As a major release it contains breaking changes, see the [release notes](RELEASES.md) for more information.
>
>@steelbreeze/state the new home for [state.js](https://github.com/steelbreeze/state.js) and the versioning starts here from v6.0.0.

If you like @steelbreeze/state, please star it...

## Install
```shell
npm i @steelbreeze/state
```

## Usage
The API is broken up into two distinct parts:
1. A set of classes that represent a state machine model (State, PseudoState, Region, Transition, etc.);
2. An interface to represent an instance of a state machine, which embodies the *active state configuration* of a state machine at runtime. This enables multiple instances adhering to the same state machine model. There are also a couple of implementations of the interface. 

### TypeScript
```typescript
import * as state from "@steelbreeze/state";

// create the state machine model elements
const model = new state.StateMachine("model");
const initial = new state.PseudoState("initial", model, state.PseudoStateKind.Initial);
const stateA = new state.State("stateA", model);
const stateB = new state.State("stateB", model);

// create the state machine model transitions
initial.to(stateA);
stateA.to(stateB).when(message => message === "move");

// create a state machine instance
let instance = new state.Instance("instance", model);

// send the machine instance a message for evaluation, this will trigger the transition from stateA to stateB
state.evaluate(instance, "move");

console.log(instance.toJSON());
```
### Output
The output of the above code will be:
```shell
initialise model
initialise instance
instance enter model.default
instance enter model.default.initial
instance leave model.default.initial
instance enter model.default.stateA
instance evaluate message: move
instance leave model.default.stateA
instance enter model.default.stateB
{"name":"instance","children":[{"name":"default","children":[],"current":"stateB","lastKnownState":"stateB"}]}
```

## License
MIT License

Copyright (c) 2014-8 David Mesquita-Morris

[npm-image]: https://img.shields.io/npm/v/@steelbreeze/state.svg
[npm-url]:       https://www.npmjs.com/package/@steelbreeze/state
[downloads-image]: https://img.shields.io/npm/dm/@steelbreeze/state.svg
