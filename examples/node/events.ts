// This example shows a model with orthogonal regions, each one waiting on a different event
// before the machine completes (a region is deemed complete when it reaches a state with no outgoing transitions).
import { log, State, Region, PseudoState, PseudoStateKind, Instance } from "../../lib/node";

// log state entry, exit and event evaluation
log.add((message: string) => console.info(message), log.Entry | log.Exit | log.Evaluate);

// create a class to encapsulate events
class Event {
	public constructor(public readonly type: string) { }

	public is(type: string): boolean {
		return this.type === type;
	}

	public toString(): string {
		return `event ${this.type}`;
	}
}

// create a simple machine in which the waiting state must be 'complete' in order to transition to the done state.
const model = new State("model");
const initial = new PseudoState("initial", model, PseudoStateKind.Initial);
const waiting = new State("waiting", model);
const complete = new State("complete", model).entry(() => console.info("Received both events"));

initial.to(waiting);
waiting.to(complete);

// create a child region which becomes complete once it has received event A.
const regionA = new Region("regionA", waiting);
const initialA = new PseudoState("initialA", regionA, PseudoStateKind.Initial);
const waitingA = new State("waitingA", regionA);
const completeA = new State("completeA", regionA).entry(() => console.info("Received event A"));

initialA.to(waitingA);
waitingA.to<Event>(completeA).on(Event).if(event => event.is("A"));

// create a child region which becomes complete once it has received event B.
const regionB = new Region("regionB", waiting);
const initialB = new PseudoState("initialB", regionB, PseudoStateKind.Initial);
const waitingB = new State("waitingB", regionB);
const completeB = new State("completeB", regionB).entry(() => console.info("Received event B"));

initialB.to(waitingB);
waitingB.to<Event>(completeB).on(Event).if(event => event.is("B"));

// create an instance of the state machine
const instance = new Instance("instance", model);

// evaluate events
instance.evaluate(new Event("A"));
instance.evaluate(new Event("B"));
