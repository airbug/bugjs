//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugcall')

//@Export('CallRequest')

//@Require('Class')
//@Require('Obj')
//@Require('UuidGenerator')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Obj             = bugpack.require('Obj');
var UuidGenerator   = bugpack.require('UuidGenerator');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {Obj}
 */
var CallRequest = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {string} type
     * @param {*} data
     */
    _constructor: function(type, data) {

        this._super();

        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {*}
         */
        this.data = data;

        /**
         * @private
         * @type {string}
         */
        this.type = type;

        /**
         * @private
         * @type {string}
         */
        this.uuid = UuidGenerator.generateUuid();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {*}
     */
    getData: function() {
        return this.data;
    },

    /**
     * @return {string}
     */
    getType: function() {
        return this.type;
    },

    /**
     * @return {string}
     */
    getUuid: function() {
        return this.uuid
    },


    //-------------------------------------------------------------------------------
    // Instance Methods
    //-------------------------------------------------------------------------------

    toObject: function() {
        console.log("Inside CallRequest#toObject");
        return {
            uuid: this.getUuid(),
            type: this.getType(),
            data: this.getData()
        }
    }
});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugcall.CallRequest', CallRequest);
