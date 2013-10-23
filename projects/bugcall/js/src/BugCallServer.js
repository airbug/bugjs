//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugcall')

//@Export('BugCallServer')

//@Require('Class')
//@Require('EventDispatcher')
//@Require('Map')
//@Require('Set')
//@Require('bugcall.CallEvent')
//@Require('bugcall.CallConnection')
//@Require('bugcall.CallManager')
//@Require('bugcall.CallManagerEvent')
//@Require('bugcall.CallResponder')
//@Require('bugcall.CallResponseHandler')
//@Require('bugcall.CallServer')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var EventDispatcher             = bugpack.require('EventDispatcher');
var Map                         = bugpack.require('Map');
var Set                         = bugpack.require('Set');
var CallEvent                   = bugpack.require('bugcall.CallEvent');
var CallConnection              = bugpack.require('bugcall.CallConnection');
var CallManager                 = bugpack.require('bugcall.CallManager');
var CallManagerEvent            = bugpack.require('bugcall.CallManagerEvent');
var CallResponder               = bugpack.require('bugcall.CallResponder');
var CallResponseHandler         = bugpack.require('bugcall.CallResponseHandler');
var CallServer                  = bugpack.require('bugcall.CallServer');


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

    _constructor: function(callServer, requestProcessor) {

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

        /**
         * @private
         * @type {BugCallRequestProcessor}
         */
        this.requestProcessor               = requestProcessor;

        //TODO BRN: This doesn't seem to be used. I think we can get rid of this map and track this relation else where
        /**
         * @private
         * @type {Map.<string, Set.<CallManager>>}
         */
        this.sessionSidToCallManagerSetMap  = new Map();

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
     * @param {string} callUuid
     * @return {Set.<CallManager>}
     */
    getCallManagerSetForSessionSid: function(sessionSid){
        return this.sessionSidToCallManagerSetMap.get(sessionSid);
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
    // Public Methods
    //-------------------------------------------------------------------------------

    registerRequestPreProcessor: function(preprocessor){
        this.requestProcessor.registerRequestPreProcessor(preprocessor);
    },

    registerRequestProcessor: function(processor){
        this.requestProcessor.registerRequestProcessor(processor);
    },

    /**
     * @param {} callConnection
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
        //NOTE: SUNG BUGBUG? callManager should also be passed in a callConnection. Fixed!!!
        var callManager = new CallManager(callConnection, callUuid);
        this.callUuidToCallManagerMap.put(callUuid, callManager);
        callManager.addEventListener(CallManagerEvent.INCOMING_REQUEST, this.hearCallManagerIncomingRequest, this);
        callManager.addEventPropagator(this);
        return callManager;
    },

    /**
     * @private
     * @param {CallManager} callManager
     */
    removeCallManager: function(callManager) {
        this.callUuidToCallManagerMap.remove(callManager.getCallUuid());
        callManager.removeEventListener(CallManagerEvent.INCOMING_REQUEST, this.hearCallManagerIncomingRequest, this);
        callManager.removeEventPropagator(this);
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
    handleConnectionClosed: function(callConnection) {
        var callManager = this.callConnectionToCallManagerMap.get(callConnection);
        this.removeCallManager(callManager);
        this.callConnectionToCallManagerMap.remove(callConnection);
        callManager.closeCall();
    },

    /**
     * @private
     * @param {CallConnection} callConnection
     */
    handleConnectionEstablished: function(callConnection) {
        //TODO BRN: This is where we will use the callConnection's handshake data to look up a previous CallManager
        // that belonged to the same connection id. If it doesn't exist, then we create a new CallManager

        var handshake       = callConnection.getHandshake();
        var callUuid        = callConnection.getHandshake().query.callUuid;
        var callManager     = this.getCallManagerForCallUuid(callUuid);
        var sessionSid      = handshake.session.sid;
        var callManagerSet  = this.sessionSidToCallManagerSetMap.get(sessionSid);

        if (!callManager) {
            callManager = this.createCallManager(callConnection, callUuid);
        }
        this.callConnectionToCallManagerMap.put(callConnection, callManager);

        if (callManagerSet) {
            callManagerSet.add(callManager);
        } else {
            this.sessionSidToCallManagerSetMap.put(sessionSid, new Set([callManager]));
        }

        callManager.openCall(callConnection);
    },

    /**
     * @private
     * @param {CallConnection} callConnection
     */
    handleConnectionFailed: function(callConnection) {

        //TODO BRN: For now we assume that there is no way to reconnect for this Call

        var callManager = this.callConnectionToCallManagerMap.get(callConnection);
        this.removeCallManager(callManager);
        this.callConnectionToCallManagerMap.remove(callConnection);
        callManager.failCall();
    },

    /**
     * @private
     * @param {IncomingRequest} incomingRequest
     */
    handleIncomingRequest: function(incomingRequest) {
        var _this           = this;
        var callManager     = incomingRequest.getCallManager();
        var callResponder   = new CallResponder(callManager, incomingRequest);
        this.requestProcessor.processRequest(incomingRequest, callResponder, function(throwable) {
            //TODO BRN: Any last minute handling we need to do?
        });
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
            this.handleConnectionFailed(callConnection);
        } else {
            this.handleConnectionClosed(callConnection);
        }
    },

    /**
     * @private
     * @param {Event} event
     */
    hearServerConnectionEstablished: function(event) {
        var callConnection = event.getData().callConnection;
        this.handleConnectionEstablished(callConnection);
    },

    /**
     * @private
     * @param {Event} event
     */
    hearCallManagerIncomingRequest: function(event) {
        var incomingRequest = event.getData().incomingRequest;
        console.log("BugCallServer IncomingRequest Type:", incomingRequest.getType());
        this.handleIncomingRequest(incomingRequest);
    }
});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugcall.BugCallServer', BugCallServer);
