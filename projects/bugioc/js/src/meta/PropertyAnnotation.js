//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugioc.PropertyAnnotation')

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
        // Private Properties
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

        /**
         * @private
         * @type {*}
         */
        this.propertyValue  = null;
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

    /**
     * @return {*}
     */
    getPropertyValue: function() {
        return this.propertyValue;
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} propertyRef
     * @return {PropertyAnnotation}
     */
    ref: function(propertyRef) {
        this.propertyRef = propertyRef;
        return this;
    },

    /**
     * @param {*} propertyValue
     * @return {PropertyAnnotation}
     */
    value: function(propertyValue) {
        this.propertyValue = propertyValue;
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
