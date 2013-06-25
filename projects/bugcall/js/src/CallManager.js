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
//@Require('bugcall.IncomingRequest')
//@Require('bugcall.IncomingResponse')


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
var IncomingRequest         = bugpack.require('bugcall.IncomingRequest');
var IncomingResponse        = bugpack.require('bugcall.IncomingResponse');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var CallManager = Class.extend(EventDispatcher, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(callConnection) {

        this._super();

        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CallConnection}
         */
        this.callConnection             = callConnection;

        /**
         * @private
         * @type {Map.<string, IncomingRequest>}
         */
        this.incomingRequestMap         = new Map();

        /**
         * @private
         * @type {Map.<string, OutgoingRequest>}
         */
        this.outgoingRequestMap         = new Map();

        /**
         * @private
         * @type {Queue.<OutgoingRequest>}
         */
        this.outgoingRequestQueue       = new Queue();

        /**
         * @private
         * @type {Set.<OutgoingRequest>}
         */
        this.pendingOutgoingRequestSet  = new Set();

        this.initializeConnection();
    },

    initializeConnection: function(){
        console.log("CallManager initializing");
        if(this.hasConnection()){
            this.callConnection.addEventListener(CallConnection.EventTypes.REQUEST,     this.hearCallConnectionRequest, this);
            this.callConnection.addEventListener(CallConnection.EventTypes.RESPONSE,    this.hearCallConnectionResponse, this);
            this.processOutgoingRequestQueue();
        }
    },

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
     * @return {boolean}
     */
    hasConnection: function() {
        return !!(this.callConnection);
    },


    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    closeCall: function() {
        //
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
        this.dispatchEvent(new CallManagerEvent(CallManagerEvent.CALL_FAILED));
    },

    /**
     * @param {OutgoingRequest} outgoingRequest
     */
    sendRequest: function(outgoingRequest) {
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
     * @param {OutgoingResponse} outgoingResponse
     */
    sendResponse: function(outgoingResponse) {
        console.log("Inside CallManager#sendResponse");
        var requestUuid = outgoingResponse.getRequestUuid();
        if (this.incomingRequestMap.containsKey(requestUuid)) {
            this.incomingRequestMap.remove(requestUuid);

            if (this.callConnection) {
                this.callConnection.sendResponse(outgoingResponse.getCallResponse());
            } else {
                // The connection has likely dropped
                //TODO BRN: What do we do if the connection has dropped?
            }
        } else {
            throw new Error("There is no request pending with the uuid:" + requestUuid + ". This request may have already been responded to.");
        }
    },


    //-------------------------------------------------------------------------------
    // Private Instance Methods
    //-------------------------------------------------------------------------------

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
     * @param {OutgoingRequest} outgoingRequest
     */
    doSendOutgoingRequest: function(outgoingRequest) {
        console.log("doSendOutgoingRequest");
        this.pendingOutgoingRequestSet.add(outgoingRequest);
        this.callConnection.sendRequest(outgoingRequest.getCallRequest());
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
            this.dispatchEvent(new CallManagerEvent(CallManagerEvent.INCOMING_RESPONSE, {
                incomingResponse: incomingResponse
            }));
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
