//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugdelta')

//@Export('ObjectChange')

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

var ObjectChange = Class.extend(DeltaChange, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     *
     */
    _constructor: function(changeType, path, propertyName, propertyValue, previousValue) {

        this._super(changeType, path);


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
ObjectChange.ChangeTypes = {
    PROPERTY_REMOVED: "ObjectChange:PropertyRemoved",
    PROPERTY_SET: "ObjectChange:PropertySet"
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugdelta.ObjectChange', ObjectChange);
