## v8.3.0
Further refactoring for performance increase and code size redution.

### Breaking changes
Downgrade Visitor from a class to an interface.

### Other noteworthy changes
Remove dependencies on globally installed tools; see [DEV.md].

## v8.2.0
This release has bumped the JavaScript version to ES2015. This then enables the use of the built-in Map collection class.

There is also minor refactoring for performance increase and code size redution.

### Breaking changes
TransitionKind.Internal has been removed as it was redundant. All transitions when initially created have internal transition semantics which can then be modified to be external or local transitions later.

Replace Instance.getState with Instance.get.

## v8.1.3
Allow calls to Instance.evaluate within an entry/exit and transition actions.

## v8.1.0
Added stronger transaction management by way of an internal transaction class and removal of unnecessary members and methods from Instance class.

Added an extendable Visitor class and JSON serializer.

### Breaking changes
Instance.getLastKnownState remamed Instance.getState.

## v8.0.0
Removal of the deprecated features in the v7 codebase.
This largely revolves around transition construction, taking the form:

```typescript
source.on(eventType).when(guard).to(target).effect(action);
```

The <code>IInstance</code> interface has been removed an only a single implementation if the <code>Instance</code> class is provided due to the additional complexities introduced by deferred event evaluation and execution. JSON serialisation has been removed due to the complexities introduced by deferred events (which are stored in the Instance class.), with a more general serialisation API planned.

Internally, performance improvements and code maintainabilty improvements.

## v7.2.8
Housekeeping release:
- Remove legacy files from lib directory
- Tidy .d.ts files and documentation

## v7.2.7
Minor performance improvements in the following areas:
- Deferred event pool processing.
- PseudoState.getTransition
- State.enterHead

## v7.2.6
Make TransitionKind a real enum to tidy up documentation. 

## v7.2.5
Fixes bug #14 where a local transition didn't exit the current state.

Adpot the use of TransitionActivation, ExternalTransitionActivation, LocalTransitionActivation and InternalTransitionActivation as per the Precise Semantics of UML State Machines document to encapsulate the logic for transition exiting of sources and entering of targets. Re-purpose TransitionKind to be a factory for the TransitionActivation strategy. 

## v7.2.4
Fixes bug #13 where direct entry to a region that is part of an orthogonal state did not cause entry to its sibling regions.

Enhance logging: change the PseudoStateKind enumeration from integer values to strings and improve the logging of state machine model elements; add better transition creation logging.

> Note: v7.2.3 was bypassed due to a release error.

## v7.2.2
Fixes a bug seen with a combination of internal transitions and testing for continuation transitions, where transition guards were passed an undefined value.

## v7.2.1
v7.2.1 Is a maintainence release, with just refactoring after the added functionallity of the last two releases. The focus area has been moving code from the runtime to the model where there was no dependency on runtime artefacts and tidying up ```TransitionKind``` by implementing it as a strategy pattern.

The ```Transition``` constructor has widened a little allowing explicit transition construction without the fluent API if so desired.

## v7.2
v7.2 addresses the issue of having to specify the trigger event type twice in the creation of transitions. This release is a breaking change if you explicity created instances of the ```ExternalTransition```, ```LocalTransition``` and ```InternalTransition``` classes, all of which have been removed; the ```Transaction``` class now caters for all types of transition. The fluent-style API as used in all the examples and tests is backward compatible.

The recommended way to create transitions is in the form:
```typescript
source.on(Event).when(guard).to(target).do(action);
```
By starting transition creation with the ```on``` method, the transition will be typed, meaning that the ```when``` and ```do``` callbacks specified in will use that event type. E.g. the format of the guard condition will be ```(event: Event) => boolean``` and the action will be ```(event: Event) => any```.

v7.2 also provides a more robust implementation of deferred events first intoduces in v7.1.
## v7.1
v7.1 is fully backwardly compatible with v7.0, but as it contains two significant new features, it warrants a minor version increment.
### New features
1. A new method, ```Transition.on``` has been added allowing for a runtime typecheck of the event type before testing any guard conditions. Note, this can test only for class types not primitive types.
2. Event deferral is now supported. A new method ```State.defer``` defines which event types the State will defer. Events are deferred until a subsiquent event causes a change to the active state configuration at which point the deferred events will be reevaluates. See these posts for more information on event deferral: http://redboltz.wikidot.com/deferred-events and https://stackoverflow.com/questions/53390674/correct-order-of-deferred-events-in-state-machine-of-uml-2-x.
### Other changes
1. ```Transition.if``` has been added as pseudonym of ```Transition.when``` and ```Transition.do``` has been added as pseudonym of ```Transition.effect```. This now gives the full form of defining a transition as ```source.to<Type>(target).on(Type).if(guard).do(action)``` with most parts being optional.

Subsiquent releases will investigate not having to specify Event twice.

## v7.0
The v7 codebase has been many months in the making, it started with a growing dissatisfaction with the v6 code and the lack of seperation between the core model elements and the runtime. There was also a growing complexity given the pre-evaluation of transitions such that it was becomnig increasingly difficult to debug. I had also started trying to split the code into a file per class, but this was proving difficult to do.

The v7 codeabase is therefore a ground-up re-write and started life as a set of packages (util, model, runtime) with controlled, one-way dependencies between them and classes in seperate files.

Certain other enhncements have been made during the development, such as state machine instances having a transactional capability so that, in event of an exception being thrown in user code or the state machine runtime due to a malformed model, the state of the instance will not change.

Finally, the performance of v7 should be far greater than the v6.

### Breaking changes
1. The ```StateMachine``` and ```FinalState``` classes have been removed; use the ```State``` class in its place.
2. The ```Transition``` class has been split into three seperate classes, ```ExternalTransition```, ```LocalTransition``` and ```ExternalTransition``` with a common abstract base class ```Transition```; the ```TransitionKind``` enumeration has been removed.
3. The ```Vertex.to``` and ```Transition.else``` helper methods used to create transitions has been removed and replaced by ```State.external```, ```State.local```, ```State.internal```, ```PseduoState.external``` and ```PseudoState.else``` helper methods. This allows better control of what transitions are valid from a given vertex. Two deprecated helpers are present, ```State.to``` and ```PseudoState.to``` which are synonyms for ```State.external``` or ```State.internal``` if no target state is provides and ```PseudoState.external```; these are for backwards compatitibility reasons.
4. Callbacks to user code for guard conditions and behaviour (state entry/exit and transition) are no longer passed the state machine instance, but solely the trigger object. If you need the instance, I suggest you use an object literal for the trigger passed into the evaluate function such as ```{instance: myInstance, event: myEvent}```; be sure to test for undefined triggers when using object literals in callbacks.
5. The ```DictionaryInstance``` and ```JSONInstance``` classes have been merged into the ```Instance``` class. If you need other types of instance classes, you can implement the ```IInstance``` class and make a custom one.
6. To query the last known state of a region, use the ```Instance.getLastKnownState``` method.
7. The ```Instance``` constructor now takes the root element of the state machine model as it's second parameter.
8. As the ```StateMachine``` class has gone, the call to ```StateMachine.initialise``` is no longer required and state machine instance initialisation is performed in the ```Instance``` constructor; also ```StateMachine.evaluate``` has been replaced with ```IInstance.evaluate```.
9. All logging is off by default; to add a logger use the ```log.add``` function. Multiple loggers can be added logging different aspects of the runtime or targeting different loging mechanisms. For example: ```log.add(message => console.info(message), log.Entry | log.Exit);``` would log as per the v6.0.x code.
10. Overriding the default random number generation is now done by a call to ```random.set``` in place of the old ```setRandom```
