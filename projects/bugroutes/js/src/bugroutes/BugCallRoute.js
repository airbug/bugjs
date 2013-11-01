//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugroutes')

//@Export('BugCallRoute')

//@Require('Class')
//@Require('Obj')
//@Require('bugroutes.ICallRoute')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class       = bugpack.require('Class');
var Obj         = bugpack.require('Obj');
var ICallRoute  = bugpack.require('bugroutes.ICallRoute');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var BugCallRoute = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(requestType, listener){

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {function(...)}
         */
        this.listener       = listener;

        /**
         * @private
         * @type {string}
         */
        this.requestType    = requestType;
    },


    //-------------------------------------------------------------------------------
    // ICallRoute Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {CallRequest} request
     * @param {CallResponder} responder
     */
    fire: function(request, responder, callback) {
        this.listener(request, responder, callback);
    },

    /**
     * @return {string}
     */
    getRequestType: function() {
        return this.requestType;
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(BugCallRoute, ICallRoute);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugroutes.BugCallRoute', BugCallRoute);
