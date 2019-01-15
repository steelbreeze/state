import { IState } from './IState';
/**
 * The serialized structure of a region's active state configuration.
 */
export interface IRegion {
    /**
     * The name of the region.
     */
    name: string;
    /**
     * The serialized structure of the region's child states.
     */
    children: IState[];
    /**
     * The name of the last known active state of the region.
     * @remarks If the region has not been entered, this may not be set.
     */
    lastKnownState: string | undefined;
}
