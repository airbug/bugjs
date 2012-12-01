//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Export('PropertyAnnotation')

//@Require('Annotation')
//@Require('Class')

var bugpack = require('bugpack');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

bugpack.declare('PropertyAnnotation');

var Annotation = bugpack.require('Annotation');
var Class = bugpack.require('Class');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var PropertyAnnotation = Class.extend(Annotation, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(propertyName) {

        this._super("Property");


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
 * @return {PropertyAnnotation}
 */
PropertyAnnotation.property = function(propertyName) {
    return new PropertyAnnotation(propertyName);
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export(PropertyAnnotation);
