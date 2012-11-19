//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('AnnotateProperty')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AnnotateProperty = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(propertyName) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {string}
         */
        this.propertyName = propertyName;

        /**
         * @private
         * @type {string}
         */
        this.propertyRef = null;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     *
     * @return {string}
     */
    getName: function() {
        return this.propertyName;
    },

    /**
     * @return {string}
     */
    getRef: function() {
        return this.propertyRef;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} propertyRef
     */
    ref: function(propertyRef) {
        this.propertyRef = propertyRef;
        return this;
    }
});


//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @param {string} propertyName
 * @return {AnnotateProperty}
 */
AnnotateProperty.property = function(propertyName) {
    return new AnnotateProperty(propertyName);
};
