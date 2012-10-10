//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@export('GraphNode')

//@require('Class')
//@require('Obj')


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

    equals: function(value) {
        if (Class.doesExtend(value, GraphNode)) {
            var value = value.getValue();
            return Obj.equals(value, this.value);
        }
        return false;
    },

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
