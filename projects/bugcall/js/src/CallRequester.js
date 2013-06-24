//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugcall')

//@Export('CallRequester')

//@Require('Class')
//@Require('Map')
//@Require('Obj')
//@Require('bugcall.CallManagerEvent')
//@Require('bugcall.CallRequest')
//@Require('bugcall.OutgoingRequest')
//@Require('bugcall.RequestFailedException')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Map                     = bugpack.require('Map');
var Obj                     = bugpack.require('Obj');
var CallManagerEvent        = bugpack.require('bugcall.CallManagerEvent');
var CallRequest             = bugpack.require('bugcall.CallRequest');
var OutgoingRequest         = bugpack.require('bugcall.OutgoingRequest');
var RequestFailedException  = bugpack.require('bugcall.RequestFailedException');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var CallRequester = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(callManager) {

        this._super();

        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CallManager}
         */
        this.callManager = callManager;

        /**
         * @private
         * @type {boolean}
         */
        this.initialized = false;

        /**
         * @private
         * @type {Map.<string, CallResponseHandler>}
         */
        this.requestUuidToResponseHandlerMap = new Map();

        this.initialize();
    },


    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {boolean}
     */
    isInitialized: function() {
        return this.initialized;
    },

    /**
     * @param {string} requestType
     * @param {Object} requestData
     * @return {CallRequest}
     */
    request: function(requestType, requestData) {
        return new CallRequest(requestType, requestData);
    },

    /**
     * @param {CallRequest} callRequest
     * @param {CallResponseHandler} callResponseHandler
     */
    sendRequest: function(callRequest, callResponseHandler) {
        var outgoingRequest = new OutgoingRequest(callRequest);
        this.requestUuidToResponseHandlerMap.put(callRequest.getUuid(), callResponseHandler);
        this.callManager.sendRequest(outgoingRequest);
    },


    //-------------------------------------------------------------------------------
    // Private Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    deinitialize: function() {
        if (this.isInitialized()) {
            this.initialized = false;
            this.callManager.removeEventListener(CallManagerEvent.INCOMING_RESPONSE, this.hearIncomingResponse, this);
            this.callManager.removeEventListener(CallManagerEvent.REQUEST_FAILED, this.hearRequestFailed, this);
        }
    },

    /**
     * @private
     */
    initialize: function() {
        if (!this.isInitialized()) {
            this.initialized = true;
            this.callManager.addEventListener(CallManagerEvent.INCOMING_RESPONSE, this.hearIncomingResponse, this);
            this.callManager.addEventListener(CallManagerEvent.REQUEST_FAILED, this.hearRequestFailed, this);
        }
    },

    /**
     * @private
     * @param {string} requestUuid
     * @param {Exception} exception
     * @param {IncomingResponse} incomingResponse
     */
    routeResponse: function(requestUuid, exception, incomingResponse) {
        var callResponseHandler = this.requestUuidToResponseHandlerMap.get(requestUuid);
        callResponseHandler.handle(exception, incomingResponse);
        this.requestUuidToResponseHandlerMap.remove(requestUuid);
    },

    /**
     * @private
     * @param {IncomingResponse} incomingResponse
     */
    processIncomingResponse: function(incomingResponse) {
        var requestUuid = incomingResponse.getRequestUuid();
        this.routeResponse(requestUuid, null, incomingResponse);
    },

    /**
     * @private
     * @param {OutgoingRequest} outgoingRequest
     */
    processRequestFailed: function(outgoingRequest) {
        var callRequest = outgoingRequest.getCallRequest();
        this.routeResponse(callRequest.getUuid(), new RequestFailedException({
            callRequest: callRequest
        }));
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Event} event
     */
    hearIncomingResponse: function(event) {
        var incomingResponse = event.getData().incomingResponse;
        this.processIncomingResponse(incomingResponse);
    },

    /**
     * @private
     * @param {Event} event
     */
    hearRequestFailed: function(event) {
        var outgoingRequest = event.getData().outgoingRequest;
        this.processRequestFailed(outgoingRequest);
    }
});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugcall.CallRequester', CallRequester);
