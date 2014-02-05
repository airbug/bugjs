//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugcall')

//@Export('CallResponder')

//@Require('Class')
//@Require('Obj')
//@Require('bugcall.CallResponse')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Obj                     = bugpack.require('Obj');
var CallResponse            = bugpack.require('bugcall.CallResponse');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var CallResponder = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(call, incomingRequest) {

        this._super();

        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Call}
         */
        this.call        = call;

        /**
         * @private
         * @type {IncomingRequest}
         */
        this.incomingRequest    = incomingRequest;
    },


    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} responseType
     * @param {*=} responseData
     * @return {CallResponse}
     */
    response: function(responseType, responseData) {
        return new CallResponse(responseType, responseData, this.incomingRequest.getUuid());
    },

    /**
     * @param {CallResponse} callResponse
     * @param {function(Throwable=)} callback
     */
    sendResponse: function(callResponse, callback) {
        this.call.sendResponse(callResponse, callback);
    }
});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugcall.CallResponder', CallResponder);
