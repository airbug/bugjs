//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('aws')

//@Export('AwsObject')

//@Require('Class')
//@Require('Obj')
//@Require('Set')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class =             bugpack.require('Class');
var Obj =               bugpack.require('Obj');
var Set =              bugpack.require('Set');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var AwsObject = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function() {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Set.<string>}
         */
        this.changedFlags = new Set();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------


    //-------------------------------------------------------------------------------
    // Public Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} property
     * @return {boolean}
     */
    hasChanged: function(property) {
        if (property) {
            return this.changedFlags.contains(property);
        } else {
            return this.changedFlags.isEmpty();
        }
    },

    /**
     * @param {string} property
     */
    setChangedFlag: function(property) {
        this.changedFlags.add(property);
    },

    /**
     *
     */
    clearChangedFlags: function() {
        this.changedFlags.clear();
    },


    //-------------------------------------------------------------------------------
    // Protected Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @abstract
     * @protected
     * @param {Object} jsonObject
     */
    jsonUpdate: function(jsonObject) {

    },

    /**
     * @abstract
     * @protected
     * @param {Object} awsObject
     */
    syncUpdate: function(awsObject) {

    }
});


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('aws.AwsObject', AwsObject);
