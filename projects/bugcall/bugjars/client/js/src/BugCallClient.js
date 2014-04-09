//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugcall.BugCallClient')
//@Autoload

//@Require('Class')
//@Require('EventDispatcher')
//@Require('Exception')
//@Require('Proxy')
//@Require('Set')
//@Require('TypeUtil')
//@Require('UuidGenerator')
//@Require('bugcall.CallClientEvent')
//@Require('bugcall.Call')
//@Require('bugcall.CallEvent')
//@Require('bugcall.CallResponder')
//@Require('bugflow.BugFlow')
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
var Proxy                       = bugpack.require('Proxy');
var Set                         = bugpack.require('Set');
var TypeUtil                    = bugpack.require('TypeUtil');
var UuidGenerator               = bugpack.require('UuidGenerator');
var CallClientEvent             = bugpack.require('bugcall.CallClientEvent');
var Call                        = bugpack.require('bugcall.Call');
var CallEvent                   = bugpack.require('bugcall.CallEvent');
var CallResponder               = bugpack.require('bugcall.CallResponder');
var BugFlow                     = bugpack.require('bugflow.BugFlow');
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
var $series                     = BugFlow.$series;
var $task                       = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var BugCallClient = Class.extend(EventDispatcher, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(callClient, call, requestProcessor, callResponseHandlerFactory, callRequestFactory) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {Call}
         */
        this.call                           = call;

        /**
         * @private
         * @type {CallClient}
         */
        this.callClient                     = callClient;

        /**
         * @private
         * @type {CallRequestFactory}
         */
        this.callRequestFactory             = callRequestFactory;

        /**
         * @private
         * @type {CallResponseHandlerFactory}
         */
        this.callResponseHandlerFactory     = callResponseHandlerFactory;

        /**
         * @private
         * @type {boolean}
         */
        this.initialized                    = false;

        /**
         * @private
         * @type {Queue}
         */
        this.outgoingRequestQueue           = new Queue();

        /**
         * @private
         * @type {RequestProcessor}
         */
        this.requestProcessor               = requestProcessor;


        Proxy.proxy(this, this.requestProcessor, [
            "deregisterRequestPreProcessor",
            "deregisterRequestProcessor",
            "registerRequestPreProcessor",
            "registerRequestProcessor"
        ]);

        Proxy.proxy(this, this.callResponseHandlerFactory, [
            "factoryCallResponseHandler"
        ]);

        Proxy.proxy(this, this.callRequestFactory, [
            "factoryCallRequest"
        ]);
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {Call}
     */
    getCall: function() {
        return this.call;
    },

    /**
     * @return {CallClient}
     */
    getCallClient: function() {
        return this.callClient;
    },

    /**
     * @return {CallResponseHandlerFactory}
     */
    getCallResponseHandlerFactory: function() {
        return this.callResponseHandlerFactory;
    },

    /**
     * @return {boolean}
     */
    isConnectionOpen: function() {
        return this.callClient.isConnectionOpen();
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
            this.call.removeEventPropagator(this);
            this.call.removeEventListener(CallEvent.INCOMING_REQUEST, this.hearCallIncomingRequest, this);
            this.callClient.removeEventListener(CallClientEvent.CONNECTION_CLOSED, this.hearCallClientConnectionClosed, this);
            this.callClient.removeEventListener(CallClientEvent.CONNECTION_OPENED, this.hearCallClientConnectionOpened, this);
            this.callClient.removeEventListener(CallClientEvent.RETRY_FAILED, this.hearCallClientRetryFailed, this);
        }
        callback();
    },

    /**
     * @param {function(Throwable=)} callback
     */
    initializeModule: function(callback) {
        if (!this.isInitialized()) {
            this.initialized = true;
            this.regenerateCallUuid();
            this.call.addEventPropagator(this);
            this.call.addEventListener(CallEvent.INCOMING_REQUEST, this.hearCallIncomingRequest, this);
            this.callClient.addEventListener(CallClientEvent.CONNECTION_CLOSED, this.hearCallClientConnectionClosed, this);
            this.callClient.addEventListener(CallClientEvent.CONNECTION_OPENED, this.hearCallClientConnectionOpened, this);
            this.callClient.addEventListener(CallClientEvent.RETRY_FAILED, this.hearCallClientRetryFailed, this);
        }
        callback();
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Throwable=)} callback
     */
    closeConnection: function(callback) {
        var _this       = this;
        $series([
            $task(function(flow) {
                _this.stopCall(function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                if (_this.callClient.isConnectionClosed()) {
                    flow.complete();
                } else {
                    var hearConnectionClosed = function(event) {
                        _this.callClient.removeEventListener(CallClientEvent.CONNECTION_CLOSED, hearConnectionClosed);
                        flow.complete();
                    };
                    _this.callClient.addEventListener(CallClientEvent.CONNECTION_CLOSED, hearConnectionClosed);
                    if (!_this.callClient.isConnectionClosing()) {
                        _this.doCloseConnection();
                    }
                }
            })
        ]).execute(callback);
    },

    /**
     * @param {*} data
     * @param {function(Throwable=)} callback
     */
    openConnection: function(data, callback) {
        var _this       = this;
        var complete    = false;
        if (this.callClient.isConnectionOpen()) {
            callback();
        } else {
            var hearConnectionOpened = function(event) {
                if (!complete) {
                    complete = true;
                    _this.callClient.removeEventListener(CallClientEvent.CONNECTION_OPENED, hearConnectionOpened);
                    _this.callClient.removeEventListener(CallClientEvent.RETRY_FAILED, hearRetryFailed);
                    callback();
                }
            };
            var hearRetryFailed = function(event) {
                if (!complete) {
                    complete = true;
                    _this.callClient.removeEventListener(CallClientEvent.CONNECTION_OPENED, hearConnectionOpened);
                    _this.callClient.removeEventListener(CallClientEvent.RETRY_FAILED, hearRetryFailed);
                    callback(new Exception("ConnectFailed", {}, "Could bot establish connection"));
                }
            };
            this.callClient.addEventListener(CallClientEvent.CONNECTION_OPENED, hearConnectionOpened);
            this.callClient.addEventListener(CallClientEvent.RETRY_FAILED, hearRetryFailed);
            if (!this.callClient.isConnectionOpening()) {
                this.doOpenConnection(data);
            }
        }
    },

    /**
     * @param {function(Throwable=)} callback
     */
    refreshCall: function(callback) {
        var _this = this;
        $series([
            $task(function(flow) {
                _this.closeConnection(function(throwable) {
                    flow.complete(throwable);
                });
            }),
            $task(function(flow) {
                _this.call.resetCall();
                _this.callClient.resetClient();
                _this.regenerateCallUuid();
                _this.openConnection(null, function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(callback);
    },

    /**
     * @param {CallRequest} callRequest
     * @param {CallResponseHandler} callResponseHandler
     * @param {function(Throwable, OutgoingRequest=)} callback
     */
    sendRequest: function(callRequest, callResponseHandler, callback) {
        this.call.sendRequest(callRequest, callResponseHandler, callback);
    },

    /**
     * @param {function(Throwable=)} callback
     */
    stopCall: function(callback) {
        var _this = this;
        if (!this.call.isStopped()) {
            var hearCallStopped = function(event) {
                _this.call.removeEventListener(CallEvent.STOPPED, hearCallStopped);
                callback();
            };
            this.call.addEventListener(CallEvent.STOPPED, hearCallStopped);
            if (!this.call.isStopping()) {
                this.call.stopCall();
            }
        } else {
            callback();
        }
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    doCloseConnection: function() {
        this.callClient.closeConnection();
    },

    /**
     * @private
     * @param {*} data
     */
    doOpenConnection: function(data) {
        var querystring = "";
        querystring += "callUuid=" + encodeURIComponent(this.call.getCallUuid());
        if (!TypeUtil.isUndefined(data) && !TypeUtil.isNull(data)) {
            querystring += "&data=" + encodeURIComponent(data);
        }
        this.callClient.openConnection(querystring);
    },

    /**
     * @private
     * @param {CallConnection} callConnection
     */
    handleConnectionClosed: function(callConnection) {
        this.call.closeCall();
    },

    /**
     * @private
     * @param {CallConnection} callConnection
     */
    handleConnectionFailed: function(callConnection) {
        this.call.failCall();
    },

    /**
     * @private
     * @param {CallConnection} callConnection
     */
    handleConnectionOpened: function(callConnection) {
        this.call.openCall(callConnection);
        this.call.startCall();
    },

    /**
     * @private
     * @param {IncomingRequest} incomingRequest
     */
    handleIncomingRequest: function(incomingRequest) {
        var callResponder = new CallResponder(this.call, incomingRequest);
        this.requestProcessor.processRequest(incomingRequest, callResponder, function(throwable) {
            //TODO BRN: Any last minute handling we need to do?
        });
    },

    /**
     * @private
     */
    handleRetryFailed: function() {
        this.call.failCall();
    },

    regenerateCallUuid: function() {
        this.call.setCallUuid(UuidGenerator.generateUuid());
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
    hearCallIncomingRequest: function(event) {
        var incomingRequest = event.getData().incomingRequest;
        this.handleIncomingRequest(incomingRequest);
    }
});


//-------------------------------------------------------------------------------
// Implement Interfaces
//-------------------------------------------------------------------------------

Class.implement(BugCallClient, IInitializeModule);


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(BugCallClient).with(
    module("bugCallClient")
        .args([
            arg().ref("callClient"),
            arg().ref("call"),
            arg().ref("requestProcessor"),
            arg().ref("callResponseHandlerFactory"),
            arg().ref("callRequestFactory")
        ])
);


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugcall.BugCallClient', BugCallClient);
