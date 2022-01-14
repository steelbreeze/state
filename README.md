# state
Executable finite state machine for TypeScript and JavaScript.

If you like @steelbreeze/state, please star it...

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][npm-url]
[![Build Status](https://travis-ci.org/steelbreeze/state.svg?branch=master)](https://travis-ci.org/steelbreeze/state)
[![Maintainability](https://api.codeclimate.com/v1/badges/ba16b2f2be9016842326/maintainability)](https://codeclimate.com/github/steelbreeze/state/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/ba16b2f2be9016842326/test_coverage)](https://codeclimate.com/github/steelbreeze/state/test_coverage)

> **Note:** v8 is now live and contains breaking changes but offers a further simplified code base performance improvements. See the [release notes](RELEASES.md) for more information.
>
> **Warning:** v8 does not yet contain any support for serialization due to the challanges brought by the introduction of deferred events which are cached within the state machine instance alongside the active state configuration. 

## Install
```shell
npm i @steelbreeze/state
```

## Usage
The API is broken up into two distinct parts:
1. A set of classes that represent a state machine model ([State](https://steelbreeze.net/state/api/v8/classes/state.html), [PseudoState](https://steelbreeze.net/state/api/v8/classes/pseudostate.html), [Region](https://steelbreeze.net/state/api/v8/classes/region.html), etc.);
2. An class managing the active state configuration of a state machine instance at runtime ([Instance](https://steelbreeze.net/state/api/v8/classes/instance.html)). 

Together, they enable multiple instances of the same state machine model.

The full API reference can be found [here](https://steelbreeze.net/state/api/v8).

### TypeScript
```typescript
import * as state from "@steelbreeze/state";

// create event class that a transition will respond to
class MyEvent {
	public constructor(public fieldA: string, public fieldB: number) { }

	public toString(): string {
		return JSON.stringify(this);
	}
}

// log state entry, exit and trigger event evaluation
state.log.add(message => console.info(message), state.log.Entry | state.log.Exit | state.log.Evaluate);

// create the state machine model elements
const model = new state.State("model");
const initial = new state.PseudoState("initial", model, state.PseudoStateKind.Initial);
const stateA = new state.State("stateA", model);
const stateB = new state.State("stateB", model);

// create the transition from initial pseudo state to stateA
initial.to(stateA);

// create a transtion from stateA to stateB a for events of type MyEvent with a guard condition
stateA.on(MyEvent).when(myEvent => myEvent.fieldB > 2).to(stateB);

// create an instance of the state machine model
let instance = new state.Instance("instance", model);

// send the machine events for evaluation
instance.evaluate(new MyEvent("test", 1));
instance.evaluate(new MyEvent("test", 3));
```
### JavaScript (ECMAScript 2015)
```javascript
var state = require("@steelbreeze/state");

// create event class that a transition will respond to
class MyEvent {
	constructor(fieldA, fieldB) { this.fieldA = fieldA; this.fieldB = fieldB; }

	toString() { return JSON.stringify(this); }
}

// log state entry, exit and trigger event evaluation
state.log.add(message => console.info(message), state.log.Entry | state.log.Exit | state.log.Evaluate);

// create the state machine model elements
const model = new state.State("model");
const initial = new state.PseudoState("initial", model, state.PseudoStateKind.Initial);
const stateA = new state.State("stateA", model);
const stateB = new state.State("stateB", model);

// create the transition from initial pseudo state to stateA
initial.to(stateA);

// create a transtion from stateA to stateB a for events of type MyEvent with a guard condition
stateA.on(MyEvent).when(myEvent => myEvent.fieldB > 2).to(stateB);

// create an instance of the state machine model
let instance = new state.Instance("instance", model);

// send the machine events for evaluation
instance.evaluate(new MyEvent("test", 1));
instance.evaluate(new MyEvent("test", 3));
```
### Output
The output of the above code will be:
```shell
instance enter model
instance enter model.default
instance enter model.default.initial
instance leave model.default.initial
instance enter model.default.stateA
instance evaluate {"fieldA":"test","fieldB":1}
instance evaluate {"fieldA":"test","fieldB":3}
instance leave model.default.stateA
instance enter model.default.stateB
```
> Note that in the example above, a *default region* is inserted as a child of ```model``` and parent of ```initial```, ```stateA``` and ```stateB```; the name of default regions copy their parent state hence seeing ```model.model``` in the output above. 
## License
MIT License

Copyright (c) 2022 David Mesquita-Morris

[npm-image]: https://img.shields.io/npm/v/@steelbreeze/state.svg
[npm-url]:       https://www.npmjs.com/package/@steelbreeze/state
[downloads-image]: https://img.shields.io/npm/dm/@steelbreeze/state.svg
