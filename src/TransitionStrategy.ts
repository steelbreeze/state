import { Transaction } from './Transaction';

/**
 * @internal
 */
export interface TransitionStrategy {
	doExitSource(transaction: Transaction, deepHistory: boolean, trigger: any): void;
	doEnterTarget(transaction: Transaction, deepHistory: boolean, trigger: any): void;
}
