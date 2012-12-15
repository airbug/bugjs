//-------------------------------------------------------------------------------
// Dependencies
//-------------------------------------------------------------------------------

//@Export('GraphNode')

//@Require('Class')
//@Require('Obj')

var bugpack = require('bugpack');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class = bugpack.require('Class');
var Obj = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var GraphNode = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(value) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {*}
         */
        this.value = value;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {*}
     */
    getValue: function() {
        return this.value;
    },


    //-------------------------------------------------------------------------------
    // Object Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {*} value
     * @return {boolean}
     */
    equals: function(value) {
        if (Class.doesExtend(value, GraphNode)) {
            var value = value.getValue();
            return Obj.equals(value, this.value);
        }
        return false;
    },

    /**
     * @return {number}
     */
    hashCode: function() {
        if (!this._hashCode) {
            this._hashCode = Obj.hashCode("[GraphNode]" + Obj.hashCode(this.value));
        }
        return this._hashCode;
    },

    /**
     * @return {string}
     */
    toString: function() {
        var output = "";
        output += "{\n";
        output += "  " + this.value.toString() + "\n";
        output += "}\n";
        return output;
    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export(GraphNode);
