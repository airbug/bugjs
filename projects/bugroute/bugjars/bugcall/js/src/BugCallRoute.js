//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugroute:bugcall.BugCallRoute')

//@Require('Class')
//@Require('Obj')
//@Require('bugroute:bugcall.ICallRoute')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Obj         = bugpack.require('Obj');
var ICallRoute  = bugpack.require('bugroute:bugcall.ICallRoute');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {Obj}
 * @implements {ICallRoute}
 */
var BugCallRoute = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {string} requestType
     * @param {function(CallRequest, CallResponder, function(Throwable))} listener
     */
    _constructor: function(requestType, listener) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {function(CallRequest, CallResponder, function(Throwable))} listener
         */
        this.listener       = listener;

        /**
         * @private
         * @type {string}
         */
        this.requestType    = requestType;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @returns {function(CallRequest, CallResponder, function(Throwable))}
     */
    getListener: function() {
        return this.listener;
    },


    //-------------------------------------------------------------------------------
    // ICallRoute Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getRequestType: function() {
        return this.requestType;
    },

    /**
     * @param {CallRequest} request
     * @param {CallResponder} responder
     * @param {function(Throwable)} callback
     */
    route: function(request, responder, callback) {
        this.listener.call(null, request, responder, callback);
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(BugCallRoute, ICallRoute);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugroute:bugcall.BugCallRoute', BugCallRoute);
