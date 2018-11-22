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

// create a state machine model that only is complete (in done state) when events A and B are received in any order
const model = new State("model");
const region = new Region("region", model);
const initial = new PseudoState("initial", region, PseudoStateKind.Initial);
const waitAB = new State("waitAB", region);
const waitA = new State("waitA", region);
const waitB = new State("waitB", region);
const done = new State("done", region).entry(() => console.info("Received both events"));

// create the transitions within the model in the form source.to(target).on(event).if(guard).do(action)
initial.to(waitAB);
waitAB.to<Event>(waitB).on(Event).if(event => event.is("A"));
waitAB.to<Event>(waitA).on(Event).if(event => event.is("B"));
waitB.to<Event>(done).on(Event).if(event => event.is("B"));
waitA.to<Event>(done).on(Event).if(event => event.is("A"));

// create an instance of the state machine
const instance = new Instance("instance", model);

// evaluate events
instance.evaluate(new Event("B"));
instance.evaluate(new Event("A"));
