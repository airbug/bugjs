//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugcall')

//@Export('CallResponder')

//@Require('Class')
//@Require('Obj')
//@Require('bugcall.CallResponse')
//@Require('bugcall.OutgoingResponse')


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
var OutgoingResponse        = bugpack.require('bugcall.OutgoingResponse');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var CallResponder = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(callManager, incomingRequest) {

        this._super();

        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CallManager}
         */
        this.callManager        = callManager;

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
        var outgoingResponse = new OutgoingResponse(callResponse);
        this.callManager.sendResponse(outgoingResponse, callback);
    }
});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugcall.CallResponder', CallResponder);
