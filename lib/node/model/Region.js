"use strict";
exports.__esModule = true;
var util_1 = require("../util");
/**
 * A region is a container of vertices (states and pseudo states) in a state machine model.
 * @public
 */
var Region = /** @class */ (function () {
    /**
     * Creates a new instance of the Region class.
     * @param name The name of the region.
     * @param parent The parent state of the region.
     * @public
     */
    function Region(name, parent) {
        var _this = this;
        this.name = name;
        this.parent = parent;
        /**
         * The child vertices belonging to this region.
         * @internal
         */
        this.children = [];
        this.qualifiedName = parent + "." + name;
        this.parent.children.unshift(this);
        util_1.log.info(function () { return "Created " + _this; }, util_1.log.Create);
    }
    /**
     * Returns the fully qualified name of the region.
     * @public
     */
    Region.prototype.toString = function () {
        return this.qualifiedName;
    };
    return Region;
}());
exports.Region = Region;
