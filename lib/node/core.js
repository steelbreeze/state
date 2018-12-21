"use strict";
exports.__esModule = true;
// TODO: move to vertex class
/** Accept a trigger and vertex: evaluate the guard conditions of the transitions and traverse if one evaluates true. */
function accept(vertex, instance, deepHistory, trigger) {
    var result = false;
    var transition = vertex.getTransition(trigger);
    if (transition) {
        transition.traverse(instance, deepHistory, trigger);
        result = true;
    }
    return result;
}
exports.accept = accept;
