"use strict";
exports.__esModule = true;
/**
 * Tree functions.
 * @hidden
 */
var tree;
(function (tree) {
    /**
     * Returns the ancesry of a node within a tree, from the root node to the provided node.
     * @param node The node to get the ancestry of.
     * @param getParent A function that will return the immediate parent of a node.
     * @returns Returns an array of nodes with the root node of the tree in element 0.
     */
    function ancestors(node, getParent) {
        var result = [];
        while (node) {
            result.unshift(node);
            node = getParent(node);
        }
        return result;
    }
    tree.ancestors = ancestors;
    /**
     * Returns the index of the lowest common ancestor of two ancestry arrays.
     * @param a The first anccesrty array.
     * @param b The second ancestry array.
     * @returns Returns the index of the lowest common ancestor.
     */
    function lca(a, b) {
        var max = Math.min(a.length, b.length);
        var result = 0;
        while (result < max && a[result] === b[result]) {
            result++;
        }
        return result - (result !== max ? 1 : 2);
    }
    tree.lca = lca;
})(tree = exports.tree || (exports.tree = {}));
