//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugcall')

//@Export('CallManager')

//@Require('Class')
//@Require('EventDispatcher')
//@Require('Map')
//@Require('Queue')
//@Require('Set')
//@Require('bugcall.CallConnection')
//@Require('bugcall.CallManagerEvent')
//@Require('bugcall.CallRequest')
//@Require('bugcall.IncomingRequest')
//@Require('bugcall.IncomingResponse')
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
var EventDispatcher         = bugpack.require('EventDispatcher');
var Map                     = bugpack.require('Map');
var Queue                   = bugpack.require('Queue');
var Set                     = bugpack.require('Set');
var CallConnection          = bugpack.require('bugcall.CallConnection');
var CallManagerEvent        = bugpack.require('bugcall.CallManagerEvent');
var CallRequest             = bugpack.require('bugcall.CallRequest');
var IncomingRequest         = bugpack.require('bugcall.IncomingRequest');
var IncomingResponse        = bugpack.require('bugcall.IncomingResponse');
var OutgoingRequest         = bugpack.require('bugcall.OutgoingRequest');
var RequestFailedException  = bugpack.require('bugcall.RequestFailedException');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var CallManager = Class.extend(EventDispatcher, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(callConnection, callUuid) {

        this._super();

        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CallConnection}
         */
        this.callConnection                     = callConnection;

        /**
         * @private
         * @type {string}
         */
        this.callUuid                           = callUuid;

        /**
         * @private
         * @type {Map.<string, IncomingRequest>}
         */
        this.incomingRequestMap                 = new Map();

        /**
         * @private
         * @type {Map.<string, OutgoingRequest>}
         */
        this.outgoingRequestMap                 = new Map();

        /**
         * @private
         * @type {Queue.<OutgoingRequest>}
         */
        this.outgoingRequestQueue               = new Queue();

        /**
         * @private
         * @type {Queue.<OutgoingResponse}
         */
        this.outgoingResponseQueue              = new Queue();

        /**
         * @private
         * @type {Set.<OutgoingRequest>}
         */
        this.pendingOutgoingRequestSet          = new Set();

        /**
         * @private
         * @type {Map.<string, CallResponseHandler>}
         */
        this.requestUuidToResponseHandlerMap    = new Map();

        /**
         * @private
         * @type {Map.<string, function(Error|Exception)}
         */
        this.responseUuidToResponseCallbackMap  = new Map();

        this.initializeConnection();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {CallConnection}
     */
    getConnection: function() {
        return this.callConnection;
    },

    /**
     * @return {string}
     */
    getCallUuid: function() {
        return this.callUuid;
    },

    /**
     * @param {string} callUuid
     */
    setCallUuid: function(callUuid) {
        this.callUuid = callUuid;
    },

    /**
     * @return {boolean}
     */
    hasConnection: function() {
        return !!(this.callConnection);
    },


    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} requestType
     * @param {Object} requestData
     * @return {CallRequest}
     */
    request: function(requestType, requestData) {
        return new CallRequest(requestType, requestData);
    },

    /**
     * @param {OutgoingRequest} outgoingRequest
     */
    sendOutgoingRequest: function(outgoingRequest) {
        console.log("Inside CallManager#sendRequest");
        console.log("OutgoingRequest:", outgoingRequest);
        console.log("Has connection?:", this.hasConnection());
        if (!this.outgoingRequestMap.containsValue(outgoingRequest)) {
            this.outgoingRequestMap.put(outgoingRequest.getUuid(), outgoingRequest);
            if (this.hasConnection()) {
                this.doSendOutgoingRequest(outgoingRequest)
            } else {
                this.doQueueOutgoingRequest(outgoingRequest);
            }
        } else {
            throw new Error("Cannot submit the same request more than once");
        }
    },

    /**
     * @param {CallRequest} callRequest
     * @param {CallResponseHandler} callResponseHandler
     */
    sendRequest: function(callRequest, callResponseHandler) {
        var outgoingRequest = new OutgoingRequest(callRequest);
        this.requestUuidToResponseHandlerMap.put(callRequest.getUuid(), callResponseHandler);
        this.sendOutgoingRequest(outgoingRequest);
    },

    /**
     * @param {OutgoingResponse} outgoingResponse
     * @param {function((Error|Exception))} callback
     */
    sendResponse: function(outgoingResponse, callback) {
        var requestUuid     = outgoingResponse.getRequestUuid();
        var responseUuid    = outgoingResponse.getUuid();
        if (this.incomingRequestMap.containsKey(requestUuid)) {
            this.responseUuidToResponseCallbackMap.put(requestUuid, callback);
            if (this.hasConnection()) {
                this.doSendOutgoingResponse(outgoingResponse);
            } else {
                this.doQueueOutgoingResponse(outgoingResponse);
            }
        } else {
            throw new Error("There is no request pending with the uuid:" + requestUuid + ". This request may have already been responded to.");
        }
    },


    // Connection
    //-------------------------------------------------------------------------------

    /**
     *
     */
    clearConnection: function() {
        console.log("CallManager clearing connection");
        if (this.hasConnection()) {
            this.callConnection.removeEventListener(CallConnection.EventTypes.REQUEST,  this.hearCallConnectionRequest, this);
            this.callConnection.removeEventListener(CallConnection.EventTypes.RESPONSE, this.hearCallConnectionResponse, this);
            this.callConnection = null;
        }
    },

    /**
     *
     */
    initializeConnection: function(){
        console.log("CallManager initializing");
        if(this.hasConnection()){
            this.callConnection.addEventListener(CallConnection.EventTypes.REQUEST,     this.hearCallConnectionRequest, this);
            this.callConnection.addEventListener(CallConnection.EventTypes.RESPONSE,    this.hearCallConnectionResponse, this);
            this.processOutgoingRequestQueue();
            this.processOutgoingResponseQueue();
        }
    },

    /**
     * @param {CallConnection} callConnection
     */
    updateConnection: function(callConnection) {
        console.log("CallManager updating connection");
        if (this.hasConnection()) {
            this.clearConnection();
        }
        this.callConnection = callConnection;
        this.initializeConnection();
    },


    // Call
    //-------------------------------------------------------------------------------

    /**
     *
     */
    closeCall: function() {
        var _this = this;
        this.clearConnection();
        this.pendingOutgoingRequestSet.forEach(function(outgoingRequest) {
            _this.doFailOutgoingRequest(outgoingRequest);
        });
    },

    /**
     *
     */
    failCall: function() {
        //TODO BRN: For now we assume that there is no way to reconnect and receive a response to an open request.
        // Any number of things could have gone wrong here
        // 1) The server could have gone down
        // 2) The client's connection could be having problems.
        // We send an error to all open requests and let the application logic determine what to do with an incomplete request.

        var _this = this;
        this.clearConnection();
        this.pendingOutgoingRequestSet.forEach(function(outgoingRequest) {
            _this.doFailOutgoingRequest(outgoingRequest);
        });
    },


    //-------------------------------------------------------------------------------
    // Private Instance Methods
    //-------------------------------------------------------------------------------

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
     * @param {OutgoingRequest} outgoingRequest
     */
    processRequestFailed: function(outgoingRequest) {
        /** @type {CallRequest} */
        var callRequest = outgoingRequest.getCallRequest();
        this.routeResponse(callRequest.getUuid(), new RequestFailedException(callRequest));
    },

    /**
     * @private
     * @param {OutgoingRequest} outgoingRequest
     */
    doFailOutgoingRequest: function(outgoingRequest) {
        this.outgoingRequestMap.remove(outgoingRequest);
        this.pendingOutgoingRequestSet.remove(outgoingRequest);
        this.dispatchEvent(new CallManagerEvent(CallManagerEvent.REQUEST_FAILED, {
            outgoingRequest: outgoingRequest
        }));
    },

    /**
     * @private
     * @param {OutgoingRequest} outgoingRequest
     */
    doQueueOutgoingRequest: function(outgoingRequest) {
        console.log("doSendOutgoingRequest");
        this.outgoingRequestQueue.enqueue(outgoingRequest);
    },

    /**
     * @private
     * @param {OutgoingResponse} outgoingResponse
     */
    doQueueOutgoingResponse: function(outgoingResponse) {
        this.outgoingResponseQueue.enqueue(outgoingResponse);
    },

    /**
     * @private
     * @param {OutgoingRequest} outgoingRequest
     */
    doSendOutgoingRequest: function(outgoingRequest) {
        var _this = this;
        this.callConnection.sendRequest(outgoingRequest.getCallRequest(), function(data) {
            //TEST
            console.log("TEST - CallManager.sendRequest callback fired - data:", data);

            _this.pendingOutgoingRequestSet.add(outgoingRequest);
        });
    },

    /**
     * @private
     * @param {OutgoingResponse} outgoingResponse
     */
    doSendOutgoingResponse: function(outgoingResponse) {
        var _this = this;
        this.callConnection.sendResponse(outgoingResponse.getCallResponse(), function(data) {
            //TEST
            console.log("TEST - CallManager.sendResponse callback fired - data:", data);

            var requestUuid = outgoingResponse.getRequestUuid();
            _this.incomingRequestMap.remove(requestUuid);
            var responseUuid = outgoingResponse.getUuid();
            var callback = _this.responseUuidToResponseCallbackMap.remove(responseUuid);

            //TODO BRN: Figure out if there's any error that can occur to pass in here...

            callback();
        });
    },

    /**
     * @private
     * @param {IncomingRequest} incomingRequest
     */
    processIncomingRequest: function(incomingRequest) {
        var requestUuid = incomingRequest.getUuid();
        this.incomingRequestMap.put(requestUuid, incomingRequest);
        this.dispatchEvent(new CallManagerEvent(CallManagerEvent.INCOMING_REQUEST, {
            incomingRequest: incomingRequest
        }));
    },

    /**
     * @private
     * @param {IncomingResponse} incomingResponse
     */
    processIncomingResponse: function(incomingResponse) {
        var requestUuid     = incomingResponse.getRequestUuid();
        var outgoingRequest = this.outgoingRequestMap.get(requestUuid);
        if (outgoingRequest) {
            this.outgoingRequestMap.remove(requestUuid);
            this.pendingOutgoingRequestSet.remove(outgoingRequest);
            this.routeResponse(requestUuid, null, incomingResponse);
        } else {
            throw new Error("Could not find outgoingRequest for this incomingResponse. IncomingResponse:" + incomingResponse.toObject());
        }
    },

    /**
     * @private
     */
    processOutgoingRequestQueue: function() {
        while (!this.outgoingRequestQueue.isEmpty()) {
            var outgoingRequest = this.outgoingRequestQueue.dequeue();
            this.doSendOutgoingRequest(outgoingRequest);
        }
    },

    /**
     * @private
     */
    processOutgoingResponseQueue: function() {
        while (!this.outgoingResponseQueue.isEmpty()) {
            var outgoingResponse = this.outgoingResponseQueue.dequeue();
            this.doSendOutgoingResponse(outgoingResponse);
        }
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Event} event
     */
    hearCallConnectionRequest: function(event) {
        console.log("Inside CallManager#hearCallConnectionRequest");
        var callRequest = event.getData().callRequest;
        if (callRequest) {
            var incomingRequest = new IncomingRequest(callRequest, this);
            this.processIncomingRequest(incomingRequest);
        } else {
            throw new Error("Incompatible request");
        }

    },

    /**
     * @private
     * @param {Event} event
     */
    hearCallConnectionResponse: function(event) {
        console.log("Inside CallManager#hearCallConnectionResponse");
        var callResponse = event.getData().callResponse;
        if (callResponse) {
            var incomingResponse = new IncomingResponse(callResponse, this);
            this.processIncomingResponse(incomingResponse);
        } else {
            throw new Error("Incompatible response");
        }
    }
});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugcall.CallManager', CallManager);
