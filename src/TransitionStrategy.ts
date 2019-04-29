import { Transaction } from './Transaction';

/**
 * @internal
 */
export interface TransitionStrategy {
	doExitSource(transaction: Transaction, history: boolean, trigger: any): void;
	doEnterTarget(transaction: Transaction, history: boolean, trigger: any): void;

	toString(): string;
}
