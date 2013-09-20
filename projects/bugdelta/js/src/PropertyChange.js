//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugdelta')

//@Export('PropertyChange')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Obj         = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var PropertyChange = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     *
     */
    _constructor: function(changeType, propertyName, previousValue, propertyValue) {

        this._super();


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {string}
         */
        this.changeType     = changeType;

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
     * @return {string}
     */
    getChangeType: function() {
        return this.changeType;
    },

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
