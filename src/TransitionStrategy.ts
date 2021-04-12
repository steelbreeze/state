import { Transaction } from './Transaction';

/**
 * @internal
 */
export interface TransitionStrategy {
	doExit(transaction: Transaction, deepHistory: boolean, trigger: any): void;
	doEnter(transaction: Transaction, deepHistory: boolean, trigger: any): void;
}
