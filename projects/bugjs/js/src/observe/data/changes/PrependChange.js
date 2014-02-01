//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('PrependChange')

//@Require('Class')
//@Require('ObservableChange')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack             = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var ObservableChange    = bugpack.require('ObservableChange');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {AddChange}
 */
var PrependChange = Class.extend(ObservableChange, /** @lends {PrependChange.prototype} */ {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {string} objectPath
     * @param {*} value
     */
    _constructor: function(objectPath, value) {

        this._super(PrependChange.CHANGE_TYPE, objectPath);


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {*}
         */
        this.value  = value;
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
    // Obj Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {boolean=} deep
     * @return {PrependChange}
     */
    clone: function(deep) {

        //TODO BRN: Implement deep cloning

        var clonePrependChange = new PrependChange(this.getObjectPath(), this.getValue(), this.getIndex());
        clonePrependChange.setChangingObservable(this.getChangingObservable());
        clonePrependChange.setReportingObservable(this.getReportingObservable());
        return clonePrependChange;
    }
});

//-------------------------------------------------------------------------------
// Class Properties
//-------------------------------------------------------------------------------

/**
 * @static
 * @const {string}
 */
PrependChange.CHANGE_TYPE = "Prepend";

//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('PrependChange', PrependChange);
