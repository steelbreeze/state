export namespace random {
	export let get: (max: number) => number = (max: number) => Math.floor(Math.random() * max);

	export function set(value: (max: number) => number): (max: number) => number {
		const previous = get;

		get = value;

		return previous;
	}
}