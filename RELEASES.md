## v7.0.0
### Breaking changes
1. The ```StateMachine``` class has been removed; use the ```State``` class in its place.
2. The ```Transition``` class has been split into three seperate classes, ```ExternalTransition```, ```LocalTransition``` and ```ExternalTransition``` with a common abstract base class ```Transition```; the ```TransitionKind``` enumeration has been removed.
3. The ```Vertex.to``` and ```Transition.else``` helper methods used to create transitions has been removed and replaced by ```State.external```, ```State.local```, ```State.internal```, ```PseduoState.external``` and ```PseudoState.else``` helper methods. This allows better control of what transitions are valid from a given vertex.
4. Callbacks to user code for guard conditions and behaviour (state entry/exit and transition) are no longer passed the state machine instance, but solely the trigger object. If you need the instance, I suggest you use an object literal for the trigger passed into the evaluate function such as ```{instance: myInstance, event: myEvent}```.
5. The ```DictionaryInstance``` class has been replaced by the ```Instance``` class.
6. The ```Instance``` constructor now takes the root element of the state machine model as it's second parameter.
7. As the ```StateMachine``` class has gone, the call to ```StateMachine.initialise``` is no longer required and state machine instance initialisation is performed in the ```Instance``` constructor; also ```StateMachine.evaluate``` has been replaced with the a stand-alone function ```evaluate```.
8. All logging is off by default; to add a logger use the ```log.add``` function. Multiple loggers can be added logging different aspects of the runtime or targeting different loging mechanisms. For example: ```log.add(message => console.info(message), log.Entry | log.Exit);``` would log as per the v6.0.x code.
 
