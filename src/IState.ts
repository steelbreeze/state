import { IRegion } from './IRegion';

/**
 * The serialized structure of a state's active state configuration.
 */
export interface IState {
	/** 
	 * The name of the state.
	 */
	name: string;

	/** 
	 * The serialized structure of the state's child regions. 
	 */
	children: IRegion[];
}
