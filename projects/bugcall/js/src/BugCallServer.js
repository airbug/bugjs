//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugcall')

//@Export('BugCallServer')

//@Require('Class')
//@Require('EventDispatcher')
//@Require('Exception')
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
var Exception                   = bugpack.require('Exception');
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

    /**
     * @constructs
     * @param {CallServer} callServer
     * @param {BugCallRequestProcessor} requestProcessor
     * @param {BugCallCallProcessor} callProcessor
     */
    _constructor: function(callServer, requestProcessor, callProcessor) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Map.<CallConnection, CallManager>}
         */
        this.callConnectionToCallManagerMap = new Map();

        /**
         * @private
         * @type {BugCallCallProcessor}
         */
        this.callProcessor                  = callProcessor;

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
     * @return {BugCallCallProcessor}
     */
    getCallProcessor: function() {
        return this.callProcessor;
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

    /**
     * @param {CallConnection} callConnection
     */
    closeConnection: function(callConnection) {
        callConnection.closeConnection();
    },

    /**
     * @param {IPreProcessCall} preProcessor
     */
    registerCallPreProcessor: function(preProcessor) {
        this.callProcessor.registerCallPreProcessor(preProcessor);
    },

    /**
     * @param {IProcessCall} processor
     */
    registerCallProcessor: function(processor) {
        this.callProcessor.registerCallProcessor(processor);
    },

    /**
     * @param {IPreProcessRequest} preprocessor
     */
    registerRequestPreProcessor: function(preprocessor) {
        this.requestProcessor.registerRequestPreProcessor(preprocessor);
    },

    /**
     * @param {IProcessRequest} processor
     */
    registerRequestProcessor: function(processor) {
        this.requestProcessor.registerRequestProcessor(processor);
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
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {CallManager} callManager
     */
    addCallManager: function(callManager) {
        this.callUuidToCallManagerMap.put(callManager.getCallUuid(), callManager);
        callManager.addEventListener(CallManagerEvent.INCOMING_REQUEST, this.hearCallManagerIncomingRequest, this);
        callManager.addEventPropagator(this);
    },

    /**
     * @private
     * @param {string} callUuid
     * @param {boolean} reconnect
     * @return {CallManager}
     */
    createCallManager: function(callUuid, reconnect) {
        return new CallManager(callUuid, reconnect);
    },

    /**
     * @private
     * @param {CallConnection} callConnection
     * @param {CallManager} callManager
     */
    mapCallConnectionToCallManager: function(callConnection, callManager) {
        this.callConnectionToCallManagerMap.put(callConnection, callManager);
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
        callManager.closeCall();
        this.removeCallManager(callManager);
        this.callConnectionToCallManagerMap.remove(callConnection);
    },

    /**
     * @private
     * @param {CallConnection} callConnection
     */
    handleConnectionEstablished: function(callConnection) {
        var _this           = this;
        /** @type {string}*/
        var callUuid        = callConnection.getHandshake().query.callUuid; //NOTE this is where the callUuid from the query is used
        /** @type {boolean} */
        var reconnect       = callConnection.getHandshake().query.reconnect === "true";
        /** @type {CallManager} */
        var callManager     = this.getCallManagerForCallUuid(callUuid);
        if (!callManager) {
            callManager = this.createCallManager(callUuid, reconnect);
            this.addCallManager(callManager);
        }
        this.mapCallConnectionToCallManager(callConnection, callManager);
        callManager.updateConnection(callConnection);
        this.callProcessor.processCall(callManager, function(throwable) {
            if (!throwable) {
                callManager.openCall();
            } else {
                if (Class.doesExtend(throwable, Exception)) {
                    console.warn(throwable);
                    callConnection.disconnect();
                } else {
                    throw throwable;
                }
            }
        });
    },

    /**
     * @private
     * @param {CallConnection} callConnection
     */
    handleConnectionFailed: function(callConnection) {

        //TODO BRN: For now we assume that there is no way to reconnect for this Call

        var callManager = this.callConnectionToCallManagerMap.get(callConnection);
        callManager.failCall();
        this.removeCallManager(callManager);
        this.callConnectionToCallManagerMap.remove(callConnection);
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

            //NOTE BRN: Unhandled throwable. At this point we should try to kill the program.
            
            if (throwable) {
                throw throwable;
            }
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
        this.handleIncomingRequest(incomingRequest);
    }
});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugcall.BugCallServer', BugCallServer);
