## v7.0.0
### Breaking changes
1. Callbacks to user code for guard conditions and behaviour (state entry/exit and transition) are no longer passed the state machine instance, but solely the trigger object. 
2. The Transition class has been split into three seperate classes, ExternalTransition, LocalTransition and ExternalTransition with a common abstract base class Transtiion; the TransitionKind enumeration has been removed.
3. The Vertex.to helper method used to create transitions has been removed and replaced by State.external, State.local, State.internal, PseduoState.external and PseudoState.else helper methods. This allows better control of what transitions are valid from a given vertex.
