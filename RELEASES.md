## v7.0.0
The v7 codebase has been many months in the making, it started with a growing dissatisfaction with the v6 code and the lack of seperation between the core model elements and the runtime. There was also a growing complexity given the pre-evaluation of transitions such that it was becomnig increasingly difficult to debug. I had also started trying to split the code into a file per class, but this was proving difficult to do.

The v7 codeabase is therefore a ground-up re-write and started life as a set of packages (util, model, runtime) with controlled, one-way dependencies between them and classes in seperate files.

Certain other enhncements have been made during the development, such as state machine instances having a transactional capability so that, in event of an exception being thrown in user code or the state machine runtime due to a malformed model, the state of the instance will not change.

Finally, the performance of v7 should be far greater than the v6.

### Breaking changes
1. The ```StateMachine``` class has been removed; use the ```State``` class in its place.
2. The ```Transition``` class has been split into three seperate classes, ```ExternalTransition```, ```LocalTransition``` and ```ExternalTransition``` with a common abstract base class ```Transition```; the ```TransitionKind``` enumeration has been removed.
3. The ```Vertex.to``` and ```Transition.else``` helper methods used to create transitions has been removed and replaced by ```State.external```, ```State.local```, ```State.internal```, ```PseduoState.external``` and ```PseudoState.else``` helper methods. This allows better control of what transitions are valid from a given vertex. Two deprecated helpers are present, ```State.to``` and ```PseudoState.to``` which are synonyms for ```State.external``` or ```State.internal``` if no target state is provides and ```PseudoState.external```; these are for backwards compatitibility reasons.
4. Callbacks to user code for guard conditions and behaviour (state entry/exit and transition) are no longer passed the state machine instance, but solely the trigger object. If you need the instance, I suggest you use an object literal for the trigger passed into the evaluate function such as ```{instance: myInstance, event: myEvent}```; be sure to test for undefined triggers when using object literals in callbacks.
5. The ```DictionaryInstance``` and ```JSONInstance``` classes have been merged into the ```Instance``` class. If you need other types of instance classes, you can implement the ```IInstance``` class and make a custom one.
6. To query the last known state of a region, use the ```Instance.getLastKnownState``` method.
7. The ```Instance``` constructor now takes the root element of the state machine model as it's second parameter.
8. As the ```StateMachine``` class has gone, the call to ```StateMachine.initialise``` is no longer required and state machine instance initialisation is performed in the ```Instance``` constructor; also ```StateMachine.evaluate``` has been replaced with ```IInstance.evaluate```.
9. All logging is off by default; to add a logger use the ```log.add``` function. Multiple loggers can be added logging different aspects of the runtime or targeting different loging mechanisms. For example: ```log.add(message => console.info(message), log.Entry | log.Exit);``` would log as per the v6.0.x code.
10. Overriding the default random number generation is now done by a call to ```random.set``` in place of the old ```setRandom```
