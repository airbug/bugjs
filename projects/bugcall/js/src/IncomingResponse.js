//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugcall')

//@Export('IncomingResponse')

//@Require('Class')
//@Require('Obj')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var Obj             = bugpack.require('Obj');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {Obj}
 */
var IncomingResponse = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(callResponse, callManager) {

        this._super();

        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CallManager}
         */
        this.callManager = callManager;

        /**
         * @private
         * @type {CallResponse}
         */
        this.callResponse = callResponse;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {CallManager}
     */
    getCallManager: function() {
        return this.callManager;
    },

    /**
     * @return {string}
     */
    getCallUuid: function() {
        return this.callManager.getCallUuid();
    },

    /**
     * @return {CallResponse}
     */
    getCallResponse: function() {
        return this.callResponse;
    },

    /**
     * @return {*}
     */
    getData: function() {
        return this.callResponse.getData();
    },

    /**
     * @return {string}
     */
    getRequestUuid: function() {
        return this.callResponse.getRequestUuid()
    },

    /**
     * @return {string}
     */
    getType: function() {
        return this.callResponse.getType();
    },

    /**
     * @return {string}
     */
    getUuid: function() {
        return this.callResponse.getUuid();
    },


    //-------------------------------------------------------------------------------
    // Instance Methods
    //-------------------------------------------------------------------------------

    toObject: function() {
        return this.callResponse.toObject();
    }
});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugcall.IncomingResponse', IncomingResponse);
