//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugcall.CallRequestService')
//@Autoload

//@Require('Class')
//@Require('Exception')
//@Require('Obj')
//@Require('bugcall.CallEvent')
//@Require('bugcall.IProcessCall')
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
// Bugpack Modules
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var Exception                   = bugpack.require('Exception');
var Obj                         = bugpack.require('Obj');
var CallEvent                   = bugpack.require('bugcall.CallEvent');
var IProcessCall                = bugpack.require('bugcall.IProcessCall');
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
var $if                         = BugFlow.$if;
var $parallel                   = BugFlow.$parallel;
var $series                     = BugFlow.$series;
var $task                       = BugFlow.$task;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @class
 * @extends {Obj}
 * @implements {IInitializeModule}
 * @implements {IProcessCall}
 */
var CallRequestService = Class.extend(Obj, {


    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {Logger} logger
     * @param {BugCallServer} bugCallServer
     * @param {CallRequestPublisher} callRequestPublisher
     * @param {CallResponseHandlerFactory} callResponseHandlerFactory
     * @param {CallRequestFactory} callRequestFactory
     */
    _constructor: function(logger, bugCallServer, callRequestPublisher, callResponseHandlerFactory, callRequestFactory) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {BugCallServer}
         */
        this.bugCallServer                  = bugCallServer;

        /**
         * @private
         * @type {CallRequestFactory}
         */
        this.callRequestFactory             = callRequestFactory;

        /**
         * @private
         * @type {CallRequestPublisher}
         */
        this.callRequestPublisher           = callRequestPublisher;

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
         * @type {Logger}
         */
        this.logger                         = logger;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {BugCallServer}
     */
    getBugCallServer: function() {
        return this.bugCallServer;
    },

    /**
     * @return {CallRequestFactory}
     */
    getCallRequestFactory: function() {
        return this.callRequestFactory;
    },

    /**
     * @return {CallRequestPublisher}
     */
    getCallRequestPublisher: function() {
        return this.callRequestPublisher;
    },

    /**
     * @return {CallResponseHandlerFactory}
     */
    getCallResponseHandlerFactory: function() {
        return this.callResponseHandlerFactory;
    },

    /**
     * @return {Logger}
     */
    getLogger: function() {
        return this.logger;
    },

    /**
     * @return {boolean}
     */
    isInitialized: function() {
        return this.initialized;
    },


    //-------------------------------------------------------------------------------
    // IProcessCall Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {Call} call
     * @param {function(Throwable=)} callback
     */
    processCall: function(call, callback) {
        var _this = this;
        $series([
            $task(function(flow) {
                _this.callRequestPublisher.subscribeToCallRequestsForCall(call.getCallUuid(), _this.receiveCallRequestMessage, _this, function(throwable) {
                    flow.complete(throwable);
                });
            })
        ]).execute(callback);
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
            this.bugCallServer.off(CallEvent.CLOSED, this.hearBugCallServerCallClosed, this);
            this.bugCallServer.deregisterCallProcessor(this);
        }
        callback();
    },

    /**
     * @param {function(Throwable=)} callback
     */
    initializeModule: function(callback) {
        if (!this.isInitialized()) {
            this.initialized = true;
            this.bugCallServer.on(CallEvent.CLOSED, this.hearBugCallServerCallClosed, this);
            this.bugCallServer.registerCallProcessor(this);
        }
        callback();
    },


    //-------------------------------------------------------------------------------
    // Message Subscribers
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Message} message
     */
    receiveCallRequestMessage: function(message) {
        var _this           = this;
        var messageData     = message.getMessageData();
        var callUuid        = messageData.callUuid;

        //TODO BRN: We need to ensure the order in which the CallRequests are sent is maintained.
        // If one CallRequest to the client fails then it needs to be retried and verified before processing the next.

        var call            = this.bugCallServer.getCallForCallUuid(callUuid);
        if (call && call.isOpen()) {
            var callRequest         = this.callRequestFactory.buildCallRequest(messageData.callRequest);
            var callResponseHandler = this.callResponseHandlerFactory.factoryCallResponseHandler(function(throwable, callResponse) {
                if (!throwable) {
                    _this.callRequestPublisher.publishCallResponse(message, callResponse, function(throwable, numberReceived) {

                        //TODO BRN: What do we do here if we receive a throwable or the numberReceived is 0 or greater than 1?
                        // If it's 1 then that's the expected response.

                        if (throwable) {
                            _this.logger.error(throwable);
                        } else {
                            _this.logger.log("Publish callResponse success - numberReceived:", numberReceived);
                        }
                    });
                } else {
                    _this.callRequestPublisher.publishThrowable(message, throwable, function(throwable, numberReceived) {
                        //TODO BRN: Check for recoverable exceptions. Request should be retried. Requeue request
                        if (throwable) {
                            _this.logger.error(throwable);
                        }
                    });
                }
            });
            call.sendRequest(callRequest, callResponseHandler, function(throwable) {
                if (throwable) {
                    _this.logger.error(throwable);
                }
            });
        } else {
            _this.callRequestPublisher.publishThrowable(message, new Exception("CallClosed"), function(throwable, numberReceived) {

                //TODO BRN: What do we do here if we receive a throwable or the numberReceived is 0 or greater than 1?
                // If it's 1 then that's the expected response.

                if (throwable) {
                    _this.logger.error(throwable);
                } else {
                    _this.logger.log("Publish callResponse success - numberReceived:", numberReceived);
                }
            });
        }
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {CallEvent} event
     */
    hearBugCallServerCallClosed: function(event) {
        var _this       = this;
        var data        = event.getData();
        var call        = data.call;
        this.callRequestPublisher.unsubscribeFromCallRequestsForCall(call.getCallUuid(), this.receiveCallRequestMessage, this, function(throwable) {
            if (throwable) {
                _this.logger.error(throwable);
            }
        });
    }
});


//-------------------------------------------------------------------------------
// Implement Interfaces
//-------------------------------------------------------------------------------

Class.implement(CallRequestService, IInitializeModule);
Class.implement(CallRequestService, IProcessCall);


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(CallRequestService).with(
    module("callRequestService")
        .args([
            arg().ref("logger"),
            arg().ref("bugCallServer"),
            arg().ref("callRequestPublisher"),
            arg().ref("callResponseHandlerFactory"),
            arg().ref("callRequestFactory")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugcall.CallRequestService', CallRequestService);
