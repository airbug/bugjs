//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugcall')

//@Export('IncomingRequest')

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
var IncomingRequest = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(callRequest, callManager) {

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
         * @type {CallRequest}
         */
        this.callRequest = callRequest;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {CallConnection}
     */
    getCallConnection: function() {
        return this.callManager.getConnection();
    },

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
     * @return {CallRequest}
     */
    getCallRequest: function() {
        return this.callRequest;
    },

    /**
     * @return {*}
     */
    getData: function() {
        return this.callRequest.getData();
    },

    /**
     * @return {Object}
     */
    getHandshake: function() {
        return this.getCallConnection().getHandshake();
    },

    /**
     * @return {string}
     */
    getType: function() {
        return this.callRequest.getType();
    },

    /**
     * @return {string}
     */
    getUuid: function() {
        console.log("Inside IncomingRequest#getUuid");
        return this.callRequest.getUuid();
    },


    //-------------------------------------------------------------------------------
    // Instance Methods
    //-------------------------------------------------------------------------------

    toObject: function() {
        return this.callRequest.toObject();
    }
});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugcall.IncomingRequest', IncomingRequest);
