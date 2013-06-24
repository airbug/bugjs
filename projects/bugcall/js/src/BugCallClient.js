//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugcall')

//@Export('BugCallClient')

//@Require('Class')
//@Require('EventDispatcher')
//@Require('bugcall.BugCallRequestEvent')
//@Require('bugcall.CallClient')
//@Require('bugcall.CallManager')
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
var BugCallRequestEvent     = bugpack.require('bugcall.BugCallRequestEvent');
var CallClient              = bugpack.require('bugcall.CallClient');
var CallManager             = bugpack.require('bugcall.CallManager');
var CallResponder           = bugpack.require('bugcall.CallResponder');
var CallResponseHandler     = bugpack.require('bugcall.CallResponseHandler');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var BugCallClient = Class.extend(EventDispatcher, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(callClient, callManager, callRequester) {

        this._super();

        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CallClient}
         */
        this.callClient = callClient;

        /**
         * @private
         * @type {CallManager}
         */
        this.callManager = callManager;

        /**
         * @private
         * @type {CallRequester}
         */
        this.callRequester = callRequester;

        /**
         * @private
         * @type {boolean}
         */
        this.initialized = false;
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
     * @return {CallRequester}
     */
    getCallRequester: function() {
        return this.callRequester;
    },

    /**
     * @return {boolean}
     */
    isInitialized: function() {
        return this.initialized;
    },


    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    closeConnection: function() {

        //TODO BRN: Add some state logic here.

        this.callClient.closeConnection();
    },

    /**
     *
     */
    openConnection: function() {

        //TODO BRN: Add some state logic here.

        this.callClient.openConnection();
    },

    /**
     * @param {string} requestType
     * @param {Object} requestData
     * @param {function(Exception, CallResponse)} requestCallback
     */
    request: function(requestType, requestData, requestCallback) {
        var callRequest = this.callRequester.request(requestType, requestData);
        var callResponseHandler = new CallResponseHandler(requestCallback);
        this.callRequester.sendRequest(callRequest, callResponseHandler);
    },


    //-------------------------------------------------------------------------------
    // Private Instance Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    initialize: function() {
        if (!this.isInitialized()) {
            this.initialized = true;
            this.callManager.addEventListener(CallManager.EventTypes.INCOMING_REQUEST, this.hearCallManagerIncomingRequest, this);
            this.callClient.addEventListener(CallClient.EventTypes.CONNECTION_CLOSED, this.hearCallClientConnectionClosed, this);
            this.callClient.addEventListener(CallClient.EventTypes.CONNECTION_OPENED, this.hearCallClientConnectionOpened, this);


            //TODO BRN: For now we assume we want to auto connect

            if (this.callClient.isConnected()) {
                this.callManager.updateConnection(this.callClient.getConnection());
            } else {
                this.callClient.openConnection();
            }
        }
    },

    /**
     * @private
     * @param {CallConnection} callConnection
     */
    processConnectionClosed: function(callConnection) {
        this.callManager.clearConnection();

        //TODO BRN: If there are pending outgoing requests, perhaps we should let them complete instead of failing them

        this.callManager.failAllPendingOutgoingRequests();
    },

    /**
     * @private
     * @param {CallConnection} callConnection
     */
    processConnectionFailed: function(callConnection) {
        this.callManager.clearConnection();
        this.callManager.failAllPendingOutgoingRequests();
    },

    /**
     * @private
     * @param {CallConnection} callConnection
     */
    processConnectionOpened: function(callConnection) {
        this.callManager.updateConnection(callConnection);
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


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Event} event
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
     * @param {Event} event
     */
    hearCallClientConnectionOpened: function(event) {
        var callConnection = event.getData().callConnection;
        this.processConnectionOpened(callConnection);
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
