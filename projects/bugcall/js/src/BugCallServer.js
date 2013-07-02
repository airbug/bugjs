//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugcall')

//@Export('BugCallServer')

//@Require('Class')
//@Require('EventDispatcher')
//@Require('Map')
//@Require('bugcall.BugCallRequestEvent')
//@Require('bugcall.BugCallServerEvent')
//@Require('bugcall.CallConnection')
//@Require('bugcall.CallManager')
//@Require('bugcall.CallManagerEvent')
//@Require('bugcall.CallResponder')
//@Require('bugcall.CallResponseHandler')
//@Require('bugcall.CallServer')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var EventDispatcher     = bugpack.require('EventDispatcher');
var Map                 = bugpack.require('Map');
var BugCallRequestEvent = bugpack.require('bugcall.BugCallRequestEvent');
var BugCallServerEvent  = bugpack.require('bugcall.BugCallServerEvent');
var CallConnection      = bugpack.require('bugcall.CallConnection');
var CallManager         = bugpack.require('bugcall.CallManager');
var CallManagerEvent    = bugpack.require('bugcall.CallManagerEvent');
var CallResponder       = bugpack.require('bugcall.CallResponder');
var CallResponseHandler = bugpack.require('bugcall.CallResponseHandler');
var CallServer          = bugpack.require('bugcall.CallServer');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {EventDispatcher}
 */
var BugCallServer = Class.extend(EventDispatcher, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(callServer) {

        this._super();

        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Map.<CallConnection, CallManager>}
         */
        this.callConnectionToCallManagerMap = new Map();

        /**
         * @private
         * @type {Map.<string, CallManager>}
         */
        this.callUuidToCallManagerMap       = new Map();

        /**
         * @private
         * @type {CallServer}
         */
        this.callServer                     = callServer;

        /**
         * @private
         * @type {boolean}
         */
        this.initialized                    = false;

        this.initialize();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @param {string} callUuid
     * @return {CallManager}
     */
    getCallManagerForCallUuid: function(callUuid) {
        return this.callUuidToCallManagerMap.get(callUuid);
    },

    /**
     * @return {CallServer}
     */
    getCallServer: function() {
        return this.callServer;
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
    closeConnection: function(callConnection) {
        callConnection.closeConnection();
    },

    /**
     * @param {CallManager} callManager
     * @param {string} requestType
     * @param {Object} requestData
     * @param {function(Exception, CallResponse)} requestCallback
     */
    request: function(callManager, requestType, requestData, requestCallback) {
        var callRequest         = callManager.request(requestType, requestData);
        var callResponseHandler = new CallResponseHandler(requestCallback);
        callManager.sendRequest(callRequest, callResponseHandler);
    },


    //-------------------------------------------------------------------------------
    // Private Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {CallConnection} callConnection
     * @param {string} callUuid
     * @return {CallManager}
     */
    createCallManager: function(callConnection, callUuid) {
        var callManager = new CallManager(callConnection, callUuid);
        this.callConnectionToCallManagerMap.put(callConnection, callManager);
        this.callUuidToCallManagerMap.put(callUuid, callManager);
        callManager.addEventListener(CallManagerEvent.INCOMING_REQUEST, this.hearCallManagerIncomingRequest, this);
        return callManager;
    },

    /**
     * @private
     * @param {CallManager} callManager
     */
    removeCallManager: function(callManager) {
        this.callConnectionToCallManagerMap.remove(callManager.getConnection());
        this.callUuidToCallManagerMap.remove(callManager.getCallUuid());
        callManager.removeEventListener(CallManagerEvent.INCOMING_REQUEST, this.hearCallManagerIncomingRequest, this);
    },

    /**
     * @private
     * @param {CallManager} callManager
     * @param {boolean} failed
     */
    dispatchCallClosed: function(callManager, failed) {
        this.dispatchEvent(new BugCallServerEvent(BugCallServerEvent.CALL_CLOSED, {
            callManager: callManager,
            failed: failed
        }));
    },

    /**
     * @private
     * @param {CallManager} callManager
     */
    dispatchCallOpened: function(callManager) {
        this.dispatchEvent(new BugCallServerEvent(BugCallServerEvent.CALL_OPENED, {
            callManager: callManager
        }));
    },

    /**
     * @private
     */
    initialize: function() {
        if (!this.isInitialized()) {
            this.initialized = true;
            this.callServer.addEventListener(CallServer.EventTypes.CONNECTION_CLOSED, this.hearServerConnectionClosed, this);
            this.callServer.addEventListener(CallServer.EventTypes.CONNECTION_ESTABLISHED, this.hearServerConnectionEstablished, this);
        }
    },

    /**
     * @private
     * @param {CallConnection} callConnection
     */
    processConnectionClosed: function(callConnection) {
        var callManager = this.callConnectionToCallManagerMap.get(callConnection);
        this.removeCallManager(callManager);
        callManager.closeCall();
        this.dispatchCallClosed(callManager, false);
    },

    /**
     * @private
     * @param {CallConnection} callConnection
     */
    processConnectionEstablished: function(callConnection) {
        //TODO BRN: This is where we will use the callConnection's handshake data to look up a previous CallManager
        // that belonged to the same connection id. If it doesn't exist, then we create a new CallManager

        var callUuid = callConnection.getHandshake().query.callUuid;
        var callManager = this.getCallManagerForCallUuid(callUuid);
        if (!callManager) {
            callManager = this.createCallManager(callConnection, callUuid);
            this.dispatchCallOpened(callManager);
        } else {
            callManager.updateConnection(callConnection);
        }
    },

    /**
     * @private
     * @param {CallConnection} callConnection
     */
    processConnectionFailed: function(callConnection) {

        //TODO BRN: For now we assume that there is no way to reconnect for this Call

        var callManager = this.callConnectionToCallManagerMap.get(callConnection);
        this.removeCallManager(callManager);
        callManager.failCall();
        this.dispatchCallClosed(callManager, true);
    },

    /**
     * @private
     * @param {IncomingRequest} incomingRequest
     */
    processIncomingRequest: function(incomingRequest) {
        var callManager     = incomingRequest.getCallManager();
        var callResponder   = new CallResponder(callManager, incomingRequest);
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
    hearServerConnectionClosed: function(event) {
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
    hearServerConnectionEstablished: function(event) {
        var callConnection = event.getData().callConnection;
        this.processConnectionEstablished(callConnection);
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
// Events
//-------------------------------------------------------------------------------

//BugCallRequestEvent.REQUEST


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugcall.BugCallServer', BugCallServer);
