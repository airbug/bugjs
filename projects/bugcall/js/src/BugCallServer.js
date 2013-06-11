//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugcall')

//@Export('BugCallServer')

//@Require('Class')
//@Require('EventDispatcher')
//@Require('Map')
//@Require('bugcall.CallConnection')
//@Require('bugcall.CallManager')
//@Require('bugcall.CallRequester')
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
var CallConnection      = bugpack.require('bugcall.CallConnection');
var CallManager         = bugpack.require('bugcall.CallManager');
var CallRequester       = bugpack.require('bugcall.CallRequester');
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
         * @type {Map.<CallConnection, CallRequester>}
         */
        this.callConnectionToCallRequesterMap = new Map();

        /**
         * @private
         * @type {CallServer}
         */
        this.callServer = callServer;

        /**
         * @private
         * @type {boolean}
         */
        this.initialized = false;

        this.initialize();
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @param {CallConnection} callConnection
     * @return {CallManager}
     */
    getCallManagerForConnection: function(callConnection) {
        return this.callConnectionToCallManagerMap.get(callConnection);
    },

    /**
     * @param {CallConnection} callConnection
     * @return {CallRequester}
     */
    getCallRequesterForConnection: function(callConnection) {
        return this.callConnectionToCallRequesterMap.get(callConnection);
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
     * @param {CallConnection} callConnection
     * @param {string} requestType
     * @param {Object} requestData
     * @param {function(Exception, CallResponse)} requestCallback
     */
    request: function(callConnection, requestType, requestData, requestCallback) {
        var callRequester = this.callConnectionToCallRequesterMap.get(callConnection);
        var callRequest = callRequester.request(requestType, requestData);
        var callResponseHandler = new CallResponseHandler(requestCallback);
        callRequester.sendRequest(callRequest, callResponseHandler);
    },


    //-------------------------------------------------------------------------------
    // Private Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {CallConnection} callConnection
     * @return {CallManager}
     */
    createCallManager: function(callConnection) {
        var callManager = new CallManager(callConnection);
        this.callConnectionToCallManagerMap.put(callConnection, callManager);
        callManager.addEventListener(CallManager.EventTypes.INCOMING_REQUEST, this.hearCallManagerIncomingRequest, this);
        return callManager;
    },

    /**
     * @private
     * @param {CallManager} callManager
     * @return {CallRequester}
     */
    createCallRequester: function(callManager) {
        var callRequester = new CallRequester(callManager);
        this.callConnectionToCallRequesterMap.put(callManager.getConnection(), callRequester);
        return callRequester;
    },

    /**
     * @private
     * @param {CallConnection} callConnection
     */
    removeCallManager: function(callConnection) {
        var callManager = this.callConnectionToCallManagerMap.get(callConnection);
        this.callConnectionToCallManagerMap.remove(callConnection);
        callManager.removeEventListener(CallManager.EventTypes.INCOMING_REQUEST, this.hearCallManagerIncomingRequest, this);
    },

    /**
     * @private
     * @param {CallConnection} callConnection
     */
    removeCallRequester: function(callConnection) {
        this.callConnectionToCallRequesterMap.remove(callConnection);
    },

    /**
     * @private
     * @param {CallConnection} callConnection
     */
    dispatchConnectionClosed: function(callConnection) {
        this.dispatchEvent(new Event(CallServer.EventTypes.CONNECTION_CLOSED, {
            callConnection: callConnection
        }));
    },

    /**
     * @private
     * @param {CallConnection} callConnection
     * @param {CallManager} callManager
     * @param {CallRequester} callRequester
     */
    dispatchConnectionEstablished: function(callConnection, callManager, callRequester) {
        this.dispatchEvent(new Event(CallServer.EventTypes.CONNECTION_ESTABLISHED, {
            callConnection: callConnection,
            callManager: callManager,
            callRequester: callRequester
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
        this.removeCallManager(callConnection);
        this.removeCallRequester(callConnection);
        this.dispatchConnectionClosed(callConnection);
    },

    /**
     * @private
     * @param {CallConnection} callConnection
     */
    processConnectionEstablished: function(callConnection) {
        var callManager = this.createCallManager(callConnection);
        var callRequester = this.createCallRequester(callManager);
        this.dispatchConnectionEstablished(callConnection, callManager, callRequester);
    },

    /**
     * @private
     * @param {IncomingRequest} incomingRequest
     */
    processIncomingRequest: function(incomingRequest) {
        var callManager = this.callConnectionToCallManagerMap.get(incomingRequest.getCallRequest());
        var callResponder = new CallResponder(callManager, incomingRequest);
        this.dispatchEvent(new Event(BugCallServer.EventTypes.REQUEST, {
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
        this.processConnectionClosed(callConnection);
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
// Static Variables
//-------------------------------------------------------------------------------

/**
 * @enum {string}
 */
BugCallServer.EventTypes = {
    CONNECTION_CLOSED: "BugCallServer:ConnectionClosed",
    CONNECTION_ESTABLISHED: "BugCallServer:ConnectionEstablished",
    REQUEST: "BugCallServer:Request"
};


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugcall.BugCallServer', BugCallServer);
