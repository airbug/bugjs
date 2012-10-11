//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('HashStoreNode')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var HashStoreNode = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        this.count = 0;

        this.valueArray = [];
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {number}
     */
    getCount: function() {
        return this.count;
    },


    //-------------------------------------------------------------------------------
    // Object Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {*} value
     * @return {boolean}
     */
    equals: function(value) {
        if (Class.doesExtend(value, HashStoreNode)) {
            if (this.getCount() === value.getCount()) {
                for (var i = 0, size = this.valueArray.length; i < size; i++) {
                    var valueArrayValue = this.valueArray[i];
                    if (!value.containsValue(valueArrayValue)) {
                        return false;
                    }
                }
                return true;
            }
        }
        return false;
    },

    /**
     * @return {string}
     */
    toString: function() {
        var output = "{";
        output += "  count:" + this.getCount() + ",\n";
        output += "  values:[\n";
        this.valueArray.forEach(function(value) {
            output += value + ",";
        });
        output += "  ]";
        output += "}";
        return output;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {*} value
     */
    addValue: function(value) {
        this.valueArray.push(value);
        this.count++;
    },

    /**
     * @param {*} value
     */
    containsValue: function(value) {
        for (var i = 0, size = this.valueArray.length; i < size; i++) {
            var valueArrayValue = this.valueArray[i];
            if (Obj.equals(value, valueArrayValue)) {
                return true;
            }
        }
        return false;
    },

    /**
     * @return {Array<*>}
     */
    getValues: function() {
        return this.valueArray;
    },

    /**
     * @param {*} value
     * @return {boolean}
     */
    removeValue: function(value) {
        for (var i = 0, size = this.valueArray.length; i < size; i++) {
            var valueArrayValue = this.valueArray[i];
            if (Obj.equals(value, valueArrayValue)) {
                this.valueArray.splice(i, 1);
                this.count--;
                return true;
            }
        }
        return false;
    }
});
