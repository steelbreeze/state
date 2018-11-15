# state
Executable finite state machine for TypeScript and JavaScript.

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][npm-url]
[![Build Status](https://travis-ci.org/steelbreeze/state.svg?branch=master)](https://travis-ci.org/steelbreeze/state)
[![Maintainability](https://api.codeclimate.com/v1/badges/ba16b2f2be9016842326/maintainability)](https://codeclimate.com/github/steelbreeze/state/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/ba16b2f2be9016842326/test_coverage)](https://codeclimate.com/github/steelbreeze/state/test_coverage)

> **Notes:**
>
>v7 is now live and contains breaking changes but offers a much simplified code base and considerable performance improvements. See the [release notes](RELEASES.md) for more information.
>
>@steelbreeze/state the new home for [state.js](https://github.com/steelbreeze/state.js) and the versioning starts here from v6.0.0.

If you like @steelbreeze/state, please star it...

## Install
```shell
npm i @steelbreeze/state
```

## Usage
The API is broken up into two distinct parts:
1. A set of classes that represent a state machine model ([State](https://steelbreeze.net/state/api/v7/classes/state.html), [PseudoState](https://steelbreeze.net/state/api/v7/classes/pseudostate.html), [Region](https://steelbreeze.net/state/api/v7/classes/region.html), etc.);
2. An interface ([IInstance](https://steelbreeze.net/state/api/v7/interfaces/iinstance.html)), and default implementation of that interface ([Instance](https://steelbreeze.net/state/api/v7/classes/instance.html)), to represent an instance of a state machine model. This embodies the *active state configuration* of a state machine instance, and enables multiple instances of the same state machine model.

The full API reference can be found [here](https://steelbreeze.net/state/api/v7).

### TypeScript
```typescript
import * as state from "@steelbreeze/state";

// log state entry, exit and trigger event evaluation
state.log.add(message => console.info(message), state.log.Entry | state.log.Exit | state.log.Evaluate);

// create the state machine model
const model = new state.State("model");
const initial = new state.PseudoState("initial", model, state.PseudoStateKind.Initial);
const stateA = new state.State("stateA", model);
const stateB = new state.State("stateB", model);

initial.to(stateA);
stateA.to(stateB).when(trigger => trigger === "move");

// create an instance of the state machine model
let instance = new state.Instance("instance", model);

// send the machine instance a message for evaluation
instance.evaluate("move");

// show the active state configuration as a JSON string
console.info(JSON.stringify(instance.toJSON()));
```
### JavaScript
```javascript
var state = require("@steelbreeze/state");

// log state entry, exit and trigger event evaluation
state.log.add(message => console.info(message), state.log.Entry | state.log.Exit | state.log.Evaluate);

// create the state machine model
var model = new state.State("model");
var initial = new state.PseudoState("initial", model, state.PseudoStateKind.Initial);
var stateA = new state.State("stateA", model);
var stateB = new state.State("stateB", model);

initial.to(stateA);
stateA.to(stateB).when(trigger => trigger === "move");

// create an instance of the state machine model
var instance = new state.Instance("instance", model);

// send the machine instance a message for evaluation
instance.evaluate("move");

// show the active state configuration as a JSON string
console.info(JSON.stringify(instance.toJSON()));
```
### Output
The output of the above code will be:
```shell
instance enter model
instance enter model.model
instance enter model.model.initial
instance leave model.model.initial
instance enter model.model.stateA
instance evaluate string trigger: move
instance leave model.model.stateA
instance enter model.model.stateB
{"name":"model","children":[{"name":"model","children":[{"name":"stateA","children":[]},{"name":"stateB","children":[]}],"lastKnownState":"stateB"}]}
```
> Note that in the example above, a *default region* is inserted as a child of ```model``` and parent of ```initial```, ```stateA``` and ```stateB```; the name of default regions copy their parent state hence seeing ```model.model``` in the output above. 
## License
MIT License

Copyright (c) 2014-8 David Mesquita-Morris

[npm-image]: https://img.shields.io/npm/v/@steelbreeze/state.svg
[npm-url]:       https://www.npmjs.com/package/@steelbreeze/state
[downloads-image]: https://img.shields.io/npm/dm/@steelbreeze/state.svg
