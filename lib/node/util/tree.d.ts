import { func } from "./func";
/**
 * Tree functions.
 * @hidden
 */
export declare namespace tree {
    /**
     * Returns the ancesry of a node within a tree, from the root node to the provided node.
     * @param node The node to get the ancestry of.
     * @param getParent A function that will return the immediate parent of a node.
     * @returns Returns an array of nodes with the root node of the tree in element 0.
     */
    function ancestors<TNode>(node: TNode | undefined, getParent: func.Func<TNode | undefined, TNode>): Array<TNode>;
    /**
     * Returns the index of the lowest common ancestor of two ancestry arrays.
     * @param a The first anccesrty array.
     * @param b The second ancestry array.
     * @returns Returns the index of the lowest common ancestor.
     */
    function lca<TNode>(a: Array<TNode>, b: Array<TNode>): number;
}
