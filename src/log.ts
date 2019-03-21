export namespace log {
	const consumers: Array<{ consumer: (message: string) => any, category: number }> = [];

	export const	Create = 1;
	export const	Entry = 2;
	export const	Exit = 4;
	export const	Evaluate = 8;
	export const	Transition = 16;
	export const	Transaction = 32;
	export const	User = 64;

	export function add(consumer: (message: string) => any, category: number): number {
		return consumers.push({ consumer, category });
	}

	export function remove(index: number): void {
		delete consumers[index];
	}

	export function write(producer: () => string, category: number): void {
		let message: string | undefined;

		consumers.forEach(consumer => {
			if (consumer && category & consumer.category) {
				consumer.consumer(message || (message = producer()));
			}
		});
	}
}
