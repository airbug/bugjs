//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugcall')

//@Export('BugCallClient')

//@Require('Class')
//@Require('EventDispatcher')
//@Require('TypeUtil')
//@Require('UuidGenerator')
//@Require('bugcall.BugCallRequestEvent')
//@Require('bugcall.CallClientEvent')
//@Require('bugcall.CallManager')
//@Require('bugcall.CallManagerEvent')
//@Require('bugcall.CallResponder')
//@Require('bugcall.CallResponseHandler')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var EventDispatcher         = bugpack.require('EventDispatcher');
var TypeUtil                = bugpack.require('TypeUtil');
var UuidGenerator           = bugpack.require('UuidGenerator');
var BugCallRequestEvent     = bugpack.require('bugcall.BugCallRequestEvent');
var CallClientEvent         = bugpack.require('bugcall.CallClientEvent');
var CallManager             = bugpack.require('bugcall.CallManager');
var CallManagerEvent        = bugpack.require('bugcall.CallManagerEvent');
var CallResponder           = bugpack.require('bugcall.CallResponder');
var CallResponseHandler     = bugpack.require('bugcall.CallResponseHandler');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var BugCallClient = Class.extend(EventDispatcher, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(callClient, callManager) {

        this._super();

        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CallClient}
         */
        this.callClient     = callClient;

        /**
         * @private
         * @type {CallManager}
         */
        this.callManager    = callManager;

        /**
         * @private
         * @type {string}
         */
        this.callUuid       = UuidGenerator.generateUuid();

        this.initialize();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {CallClient}
     */
    getCallClient: function() {
        return this.callClient;
    },

    /**
     * @return {CallManager}
     */
    getCallManager: function() {
        return this.callManager;
    },

    isConnected: function() {
        return this.callClient.isConnected();
    },

    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    closeConnection: function() {

        //TODO BRN: Add some state logic here.
        //TODO BRN: start the process of winding down the callManager so that it starts
        //queuing requests again instead of sending them. Let it complete all open requests before closing the connection.

        this.callClient.closeConnection();
    },

    /**
     * @param {*} data
     */
    openConnection: function(data) {
        if (!this.callClient.isConnected() && !this.callClient.isConnecting()) {
            this.doOpenConnection(data);
        } else {
            throw new Error("BugCallClient is already connected");
        }
    },

    /**
     * @param {string} requestType
     * @param {Object} requestData
     * @param {function(Exception, CallResponse)} requestCallback
     */
    request: function(requestType, requestData, requestCallback) {
        var callRequest = this.callManager.request(requestType, requestData);
        var callResponseHandler = new CallResponseHandler(requestCallback);
        this.callManager.sendRequest(callRequest, callResponseHandler);
    },


    //-------------------------------------------------------------------------------
    // Private Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {*} data
     */
    doOpenConnection: function(data) {
        var querystring = "";
        querystring += "callUuid=" + encodeURIComponent(this.callUuid);
        if (!TypeUtil.isUndefined(data) && !TypeUtil.isNull(data)) {
            querystring += "&data=" + encodeURIComponent(data);
        }
        this.callClient.openConnection(querystring);
    },

    /**
     * @private
     */
    initialize: function() {
        this.callManager.setCallUuid(this.callUuid);
        this.callManager.addEventPropagator(this);
        this.callManager.addEventListener(CallManagerEvent.INCOMING_REQUEST, this.hearCallManagerIncomingRequest, this);
        this.callClient.addEventListener(CallClientEvent.CONNECTION_CLOSED, this.hearCallClientConnectionClosed, this);
        this.callClient.addEventListener(CallClientEvent.CONNECTION_OPENED, this.hearCallClientConnectionOpened, this);
        this.callClient.addEventListener(CallClientEvent.RETRY_FAILED, this.hearCallClientRetryFailed, this);
    },

    /**
     * @private
     * @param {CallConnection} callConnection
     */
    processConnectionClosed: function(callConnection) {
        this.callManager.closeCall();
    },

    /**
     * @private
     * @param {CallConnection} callConnection
     */
    processConnectionFailed: function(callConnection) {
        this.callManager.failCall();
    },

    /**
     * @private
     * @param {CallConnection} callConnection
     */
    processConnectionOpened: function(callConnection) {
        this.callManager.openCall(callConnection);
    },

    /**
     * @private
     * @param {IncomingRequest} incomingRequest
     */
    processIncomingRequest: function(incomingRequest) {
        var callResponder = new CallResponder(this.callManager, incomingRequest);
        this.dispatchEvent(new BugCallRequestEvent(BugCallRequestEvent.REQUEST, {
            request: incomingRequest,
            responder: callResponder
        }));
    },

    /**
     * @private
     */
    processRetryFailed: function() {
        this.callManager.failCall();
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {CallClientEvent} event
     */
    hearCallClientConnectionClosed: function(event) {
        var callConnection = event.getData().callConnection;
        if (event.getData().failed) {
            this.processConnectionFailed(callConnection);
        } else {
            this.processConnectionClosed(callConnection);
        }
    },

    /**
     * @private
     * @param {CallClientEvent} event
     */
    hearCallClientConnectionOpened: function(event) {
        var callConnection = event.getData().callConnection;
        this.processConnectionOpened(callConnection);
    },

    /**
     * @private
     * @param {CallClientEvent} event
     */
    hearCallClientRetryFailed: function(event) {
        this.processRetryFailed();
    },

    /**
     * @private
     * @param {Event} event
     */
    hearCallManagerIncomingRequest: function(event) {
        var incomingRequest = event.getData().incomingRequest;
        this.processIncomingRequest(incomingRequest);
    }
});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugcall.BugCallClient', BugCallClient);
