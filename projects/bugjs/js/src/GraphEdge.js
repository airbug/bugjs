//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('GraphEdge')

//@Require('Class')
//@Require('GraphNode')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var GraphEdge = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(fromNode, toNode) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {GraphNode}
         */
        this.fromNode = fromNode;

        /**
         * @private
         * @type {GraphNode}
         */
        this.toNode = toNode;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {GraphNode}
     */
    getFromNode: function() {
        return this.fromNode;
    },

    /**
     * @return {GraphNode}
     */
    getToNode: function() {
        return this.toNode;
    },


    //-------------------------------------------------------------------------------
    // Object Implementation
    //-------------------------------------------------------------------------------

    equals: function(value) {
        if (Class.doesExtend(value, GraphEdge)) {
            return (Obj.equals(value.getFromNode(), this.getFromNode()) && Obj.equals(value.getToNode(), this.getToNode()));
        }
        return false;
    },

    hashCode: function() {
        if (!this._hashCode) {
            this._hashCode = Obj.hashCode("[GraphEdge]" + Obj.hashCode(this.fromNode) + "_" + Obj.hashCode(this.toNode));
        }
        return this._hashCode;
    },

    /**
     * @return {string}
     */
    toString: function() {
        var output = "";
        output += "{\n";

        output += "}\n";
        return output;
    }
});
