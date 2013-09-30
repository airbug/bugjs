//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugdelta')

//@Export('PropertyChange')

//@Require('Class')
//@Require('bugdelta.DeltaChange')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack         = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var DeltaChange     = bugpack.require('bugdelta.DeltaChange');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var PropertyChange = Class.extend(DeltaChange, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     *
     */
    _constructor: function(path, changeType, propertyName, previousValue, propertyValue) {

        this._super(path, changeType);


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {*}
         */
        this.previousValue  = previousValue;

        /**
         * @private
         * @type {string}
         */
        this.propertyName   = propertyName;

        /**
         * @private
         * @type {*}
         */
        this.propertyValue  = propertyValue;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {*}
     */
    getPreviousValue: function() {
        return this.previousValue;
    },

    /**
     * @return {string}
     */
    getPropertyName: function() {
        return this.propertyName;
    },

    /**
     * @return {*}
     */
    getPropertyValue: function() {
        return this.propertyValue;
    }
});


//-------------------------------------------------------------------------------
// Static Variables
//-------------------------------------------------------------------------------

/**
 * @static
 * @type {Object}
 */
PropertyChange.ChangeTypes = {
    PROPERTY_REMOVED: "PropertyChange:PropertyRemoved",
    PROPERTY_SET: "PropertyChange:PropertySet"
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugdelta.PropertyChange', PropertyChange);
