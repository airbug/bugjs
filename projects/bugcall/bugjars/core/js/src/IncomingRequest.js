//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugcall.IncomingRequest')

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

    _constructor: function(callRequest, call) {

        this._super();

        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Call}
         */
        this.call = call;

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
        return this.call.getConnection();
    },

    /**
     * @return {Call}
     */
    getCall: function() {
        return this.call;
    },

    /**
     * @return {string}
     */
    getCallUuid: function() {
        return this.call.getCallUuid();
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
