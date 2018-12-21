import { Vertex } from './Vertex';
import { Instance } from './Instance';
/** Accept a trigger and vertex: evaluate the guard conditions of the transitions and traverse if one evaluates true. */
export declare function accept(vertex: Vertex, instance: Instance, deepHistory: boolean, trigger: any): boolean;
