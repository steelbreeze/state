import { Transaction } from '.';

/**
 * @internal
 */
export interface TransitionStrategy {
	doExitSource(transaction: Transaction, history: boolean, trigger: any): void;
	doEnterTarget(transaction: Transaction, history: boolean, trigger: any): void;

	toString(): string;
}
