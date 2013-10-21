//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugioc')

//@Export('PropertyAnnotation')

//@Require('Class')
//@Require('bugmeta.Annotation')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Annotation      = bugpack.require('bugmeta.Annotation');


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
        this.propertyName   = propertyName;

        /**
         * @private
         * @type {string}
         */
        this.propertyRef    = null;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getPropertyName: function() {
        return this.propertyName;
    },

    /**
     * @return {string}
     */
    getPropertyRef: function() {
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

bugpack.export('bugioc.PropertyAnnotation', PropertyAnnotation);
