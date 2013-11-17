//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugcall')

//@Export('BugCallClient')

//@Require('Class')
//@Require('EventDispatcher')
//@Require('Set')
//@Require('TypeUtil')
//@Require('UuidGenerator')
//@Require('bugcall.CallClientEvent')
//@Require('bugcall.CallManager')
//@Require('bugcall.CallManagerEvent')
//@Require('bugcall.CallResponder')
//@Require('bugcall.CallResponseHandler')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var EventDispatcher             = bugpack.require('EventDispatcher');
var Set                         = bugpack.require('Set');
var TypeUtil                    = bugpack.require('TypeUtil');
var UuidGenerator               = bugpack.require('UuidGenerator');
var CallClientEvent             = bugpack.require('bugcall.CallClientEvent');
var CallManager                 = bugpack.require('bugcall.CallManager');
var CallManagerEvent            = bugpack.require('bugcall.CallManagerEvent');
var CallResponder               = bugpack.require('bugcall.CallResponder');
var CallResponseHandler         = bugpack.require('bugcall.CallResponseHandler');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var BugCallClient = Class.extend(EventDispatcher, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(callClient, callManager, requestProcessor) {

        this._super();

        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CallClient}
         */
        this.callClient                     = callClient;

        /**
         * @private
         * @type {CallManager}
         */
        this.callManager                    = callManager;

        /**
         * @private
         * @type {string}
         */
        this.callUuid                       = UuidGenerator.generateUuid();

        /**
         * @private
         * @type {BugCallRequestProcessor}
         */
        this.requestProcessor               = requestProcessor;


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

    /**
     * @return {boolean}
     */
    isConnected: function() {
        return this.callClient.isConnected();
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    registerRequestPreProcessor: function(preprocessor) {
        this.requestProcessor.registerRequestPreProcessor(preprocessor);
    },

    registerRequestProcessor: function(processor) {
        this.requestProcessor.registerRequestProcessor(processor);
    },

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
        console.log("Inside BugCallClient#request");
        console.log("requestType:", requestType, "requestData", requestData);
        var callResponseHandler = new CallResponseHandler(requestCallback);
        this.callManager.sendRequest(callRequest, callResponseHandler);
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} querystring
     */
    createConnection: function(querystring) {
        console.log("BugCallClient opening connection");
        this.doOpenConnection(querystring);
    },

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
    handleConnectionClosed: function(callConnection) {
        this.callManager.closeCall();
    },

    /**
     * @private
     * @param {CallConnection} callConnection
     */
    handleConnectionFailed: function(callConnection) {
        this.callManager.failCall();
    },

    /**
     * @private
     * @param {CallConnection} callConnection
     */
    handleConnectionOpened: function(callConnection) {
        this.callManager.openCall(callConnection);
    },

    /**
     * @private
     * @param {IncomingRequest} incomingRequest
     */
    handleIncomingRequest: function(incomingRequest) {
        var callResponder = new CallResponder(this.callManager, incomingRequest);
        this.requestProcessor.processRequest(incomingRequest, callResponder, function(throwable) {
            //TODO BRN: Any last minute handling we need to do?
        });
    },

    /**
     * @private
     */
    handleRetryFailed: function() {
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
            this.handleConnectionFailed(callConnection);
        } else {
            this.handleConnectionClosed(callConnection);
        }
    },

    /**
     * @private
     * @param {CallClientEvent} event
     */
    hearCallClientConnectionOpened: function(event) {
        var callConnection = event.getData().callConnection;
        this.handleConnectionOpened(callConnection);
    },

    /**
     * @private
     * @param {CallClientEvent} event
     */
    hearCallClientRetryFailed: function(event) {
        this.handleRetryFailed();
    },

    /**
     * @private
     * @param {Event} event
     */
    hearCallManagerIncomingRequest: function(event) {
        var incomingRequest = event.getData().incomingRequest;
        this.handleIncomingRequest(incomingRequest);
    }
});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugcall.BugCallClient', BugCallClient);
