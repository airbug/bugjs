//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugcall.BugCallServer')
//@Autoload

//@Require('Class')
//@Require('EventDispatcher')
//@Require('Exception')
//@Require('Map')
//@Require('Proxy')
//@Require('Set')
//@Require('bugcall.CallConnection')
//@Require('bugcall.Call')
//@Require('bugcall.CallEvent')
//@Require('bugcall.CallResponder')
//@Require('bugcall.CallServer')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.IInitializeModule')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')


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
var Proxy                       = bugpack.require('Proxy');
var Set                         = bugpack.require('Set');
var CallConnection              = bugpack.require('bugcall.CallConnection');
var Call                        = bugpack.require('bugcall.Call');
var CallEvent                   = bugpack.require('bugcall.CallEvent');
var CallResponder               = bugpack.require('bugcall.CallResponder');
var CallServer                  = bugpack.require('bugcall.CallServer');
var ArgAnnotation               = bugpack.require('bugioc.ArgAnnotation');
var IInitializeModule           = bugpack.require('bugioc.IInitializeModule');
var ModuleAnnotation            = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                         = ArgAnnotation.arg;
var bugmeta                     = BugMeta.context();
var module                      = ModuleAnnotation.module;


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
     * @param {Logger} logger
     * @param {CallServer} callServer
     * @param {RequestProcessor} requestProcessor
     * @param {CallProcessor} callProcessor
     */
    _constructor: function(logger, callServer, requestProcessor, callProcessor) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Map.<CallConnection, Call>}
         */
        this.callConnectionToCallMap        = new Map();

        /**
         * @private
         * @type {CallProcessor}
         */
        this.callProcessor                  = callProcessor;

        /**
         * @private
         * @type {Map.<string, Call>}
         */
        this.callUuidToCallMap              = new Map();

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
         * @type {Logger}
         */
        this.logger                         = logger;

        /**
         * @private
         * @type {RequestProcessor}
         */
        this.requestProcessor               = requestProcessor;

        Proxy.proxy(this, this.callProcessor, [
            "deregisterCallPreProcessor",
            "deregisterCallProcessor",
            "registerCallPreProcessor",
            "registerCallProcessor"
        ]);

        Proxy.proxy(this, this.requestProcessor, [
            "deregisterRequestPreProcessor",
            "deregisterRequestProcessor",
            "registerRequestPreProcessor",
            "registerRequestProcessor"
        ]);
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @param {string} callUuid
     * @return {Call}
     */
    getCallForCallUuid: function(callUuid) {
        return this.callUuidToCallMap.get(callUuid);
    },

    /**
     * @return {CallProcessor}
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
     * @return {Logger}
     */
    getLogger: function() {
        return this.logger;
    },

    /**
     * @return {RequestProcessor}
     */
    getRequestProcessor: function() {
        return this.requestProcessor;
    },

    /**
     * @return {boolean}
     */
    isInitialized: function() {
        return this.initialized;
    },


    //-------------------------------------------------------------------------------
    // IInitializeModule Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Throwable=)} callback
     */
    deinitializeModule: function(callback) {
        if (this.isInitialized()) {
            this.initialized = false;
            this.callServer.removeEventListener(CallServer.EventTypes.CONNECTION_CLOSED, this.hearServerConnectionClosed, this);
            this.callServer.removeEventListener(CallServer.EventTypes.CONNECTION_ESTABLISHED, this.hearServerConnectionEstablished, this);
        }
        callback();
    },

    /**
     * @param {function(Throwable=)} callback
     */
    initializeModule: function(callback) {
        if (!this.isInitialized()) {
            this.initialized = true;
            this.callServer.addEventListener(CallServer.EventTypes.CONNECTION_CLOSED, this.hearServerConnectionClosed, this);
            this.callServer.addEventListener(CallServer.EventTypes.CONNECTION_ESTABLISHED, this.hearServerConnectionEstablished, this);
        }
        callback();
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------



    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Call} call
     */
    addCall: function(call) {
        this.callUuidToCallMap.put(call.getCallUuid(), call);
        call.addEventListener(CallEvent.INCOMING_REQUEST, this.hearCallIncomingRequest, this);
        call.addEventPropagator(this);
    },

    /**
     * @private
     * @param {string} callUuid
     * @param {boolean} reconnect
     * @return {Call}
     */
    createCall: function(callUuid, reconnect) {
        return new Call(this.logger, callUuid, reconnect);
    },

    /**
     * @private
     * @param {CallConnection} callConnection
     * @param {Call} call
     */
    mapCallConnectionToCall: function(callConnection, call) {
        this.callConnectionToCallMap.put(callConnection, call);
    },

    /**
     * @private
     * @param {Call} call
     */
    removeCall: function(call) {
        this.callUuidToCallMap.remove(call.getCallUuid());
        call.removeEventListener(CallEvent.INCOMING_REQUEST, this.hearCallIncomingRequest, this);
        call.removeEventPropagator(this);
    },

    /**
     * @private
     * @param {CallConnection} callConnection
     */
    handleConnectionClosed: function(callConnection) {
        var call = this.callConnectionToCallMap.get(callConnection);
        call.closeCall();
        this.removeCall(call);
        this.callConnectionToCallMap.remove(callConnection);
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
        /** @type {Call} */
        var call     = this.getCallForCallUuid(callUuid);
        if (!call) {
            call = this.createCall(callUuid, reconnect);
            this.addCall(call);
        }
        this.mapCallConnectionToCall(callConnection, call);
        call.openCall(callConnection);
        this.callProcessor.processCall(call, function(throwable) {
            if (!throwable) {
                call.startCall();
            } else {
                if (Class.doesExtend(throwable, Exception)) {
                    _this.logger.warn(throwable);
                    callConnection.disconnect();
                } else {
                    _this.logger.error(throwable);
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

        var call = this.callConnectionToCallMap.get(callConnection);
        call.failCall();
        this.removeCall(call);
        this.callConnectionToCallMap.remove(callConnection);
    },

    /**
     * @private
     * @param {IncomingRequest} incomingRequest
     */
    handleIncomingRequest: function(incomingRequest) {
        var _this           = this;
        var call            = incomingRequest.getCall();
        var callResponder   = new CallResponder(call, incomingRequest);
        this.requestProcessor.processRequest(incomingRequest, callResponder, function(throwable) {

            //NOTE BRN: Unhandled throwable. At this point we should try to kill the program.
            
            if (throwable) {
                _this.logger.error(throwable);
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
    hearCallIncomingRequest: function(event) {
        var incomingRequest = event.getData().incomingRequest;
        this.handleIncomingRequest(incomingRequest);
    }
});


//-------------------------------------------------------------------------------
// Implement Interfaces
//-------------------------------------------------------------------------------

Class.implement(BugCallServer, IInitializeModule);


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(BugCallServer).with(
    module("bugCallServer")
        .args([
            arg().ref("logger"),
            arg().ref("callServer"),
            arg().ref("requestProcessor"),
            arg().ref("callProcessor")
        ])
);


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugcall.BugCallServer', BugCallServer);
