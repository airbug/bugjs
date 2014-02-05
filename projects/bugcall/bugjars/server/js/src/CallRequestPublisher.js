//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugcall')

//@Export('CallRequestPublisher')
//@Autoload

//@Require('ArgUtil')
//@Require('Class')
//@Require('Exception')
//@Require('Obj')
//@Require('Set')
//@Require('bugcall.CallDefines')
//@Require('bugflow.BugFlow')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('bugtrace.BugTrace')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var ArgUtil                 = bugpack.require('ArgUtil');
var Class                   = bugpack.require('Class');
var Exception               = bugpack.require('Exception');
var Obj                     = bugpack.require('Obj');
var Set                     = bugpack.require('Set');
var CallDefines             = bugpack.require('bugcall.CallDefines');
var BugFlow                 = bugpack.require('bugflow.BugFlow');
var ArgAnnotation           = bugpack.require('bugioc.ArgAnnotation');
var ModuleAnnotation        = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta                 = bugpack.require('bugmeta.BugMeta');
var BugTrace                = bugpack.require('bugtrace.BugTrace');


//-------------------------------------------------------------------------------
// Simplify References
//-------------------------------------------------------------------------------

var arg                     = ArgAnnotation.arg;
var bugmeta                 = BugMeta.context();
var module                  = ModuleAnnotation.module;
var $iterableParallel       = BugFlow.$iterableParallel;
var $parallel               = BugFlow.$parallel;
var $series                 = BugFlow.$series;
var $task                   = BugFlow.$task;
var $traceWithError         = BugTrace.$traceWithError;


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var CallRequestPublisher = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    /**
     * @constructs
     * @param {Logger} logger
     * @param {CallManager} callManager
     * @param {CallRequestManager} callRequestManager
     * @param {CallRequestFactory} callRequestFactory
     * @param {CallResponseHandlerFactory} callResponseHandlerFactory
     * @param {PubSub} pubSub
     */
    _constructor: function(logger, callManager, callRequestManager, callRequestFactory, callResponseHandlerFactory, pubSub) {

        this._super();


        //-------------------------------------------------------------------------------
        // Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CallManager}
         */
        this.callManager                    = callManager;

        /**
         * @private
         * @type {CallRequestFactory}
         */
        this.callRequestFactory             = callRequestFactory;

        /**
         * @private
         * @type {CallRequestManager}
         */
        this.callRequestManager             = callRequestManager;

        /**
         * @private
         * @type {CallResponseHandlerFactory}
         */
        this.callResponseHandlerFactory     = callResponseHandlerFactory;

        /**
         * @private
         * @type {Logger}
         */
        this.logger                         = logger;

        /**
         * @private
         * @type {PubSub}
         */
        this.pubSub                         = pubSub;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {CallManager}
     */
    getCallManager: function() {
        return this.callManager;
    },

    /**
     * @return {CallRequestFactory}
     */
    getCallRequestFactory: function() {
        return this.callRequestFactory;
    },

    /**
     * @return {CallRequestManager}
     */
    getCallRequestManager: function() {
        return this.callRequestManager;
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
     * @return {PubSub}
     */
    getPubSub: function() {
        return this.pubSub;
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} requestType
     * @param {*} requestData
     * @return {CallRequest}
     */
    factoryCallRequest: function(requestType, requestData) {
        return this.callRequestFactory.factoryCallRequest(requestType, requestData);
    },

    /**
     * @param {function(Throwable, CallResponse=)} responseHandlerFunction
     * @param {Object=} responseHandlerContext
     * @return {CallResponseHandler}
     */
    factoryCallResponseHandler: function(responseHandlerFunction, responseHandlerContext) {
        return this.callResponseHandlerFactory.factoryCallResponseHandler(responseHandlerFunction, responseHandlerContext);
    },

    /**
     * @param {string} callUuid
     * @param {CallRequest} callRequest
     * @param {CallResponseHandler} callResponseHandler
     * @param {function(Throwable=)} callback
     */
    publishCallRequest: function(callUuid, callRequest, callResponseHandler, callback) {
        var _this           = this;
        var channel         = this.generateCallRequestChannel(callUuid);
        var complete        = false;
        var timeoutId       = null;
        var message         = this.pubSub.factoryMessage({
            messageType: CallDefines.MessageTypes.CALL_REQUEST,
            messageData: {
                callUuid: callUuid,
                callRequest: callRequest
            }
        });

        $task(function(flow) {
            _this.pubSub.publishAndSubscribeToResponse(channel, message, function(responseMessage) {
                if (!complete) {
                    complete            = true;
                    clearTimeout(timeoutId);
                    var messageData     = responseMessage.getMessageData();
                    var callResponse    = null;
                    var throwable       = null;
                    switch(responseMessage.getMessageType()) {
                        case CallDefines.MessageTypes.CALL_RESPONSE:
                            callResponse    = messageData.callResponse;
                            break;
                        case CallDefines.MessageTypes.CALL_THROWABLE:
                            throwable       = messageData.throwable;
                            break;
                    }
                    callResponseHandler.handle(throwable, callResponse);
                }
            }, null, function(throwable, numberReceived) {
                if (!throwable) {
                    if (numberReceived === 0) {
                        flow.error(new Exception("MessageNotDelivered", {}, "Message was not received by anyone"));
                    } else {
                        if (numberReceived > 1) {
                            console.warn("more than one server received transaction message. This should not happen");
                        }

                        // do nothing more since we don't want to proceed to the next task until we receive a response
                        // NOTE BRN: There is a chance that the server that received the transaction message could go down
                        // and this would be left hanging.

                        timeoutId = setTimeout(function() {
                            if (!complete) {
                                complete = true;
                                callResponseHandler.handle(new Exception("RequestTimeout"), null);
                            }
                        }, 60 * 1000);
                        flow.complete();
                    }
                } else {
                    flow.error(throwable);
                }
            });
        }).execute(callback);
    },

    /**
     * @param {Message} replyToMessage
     * @param {CallResponse} callResponse
     * @param {function(Throwable, number=)} callback
     */
    publishCallResponse: function(replyToMessage, callResponse, callback) {
        var message         = this.pubSub.factoryMessage({
            messageType: CallDefines.MessageTypes.CALL_RESPONSE,
            messageData: {
                callResponse: callResponse
            }
        });
        this.publishResponse(replyToMessage, message, callback);
    },

    /**
     * @param {Message} replyToMessage
     * @param {Throwable} throwable
     * @param {function(Throwable, number=)} callback
     */
    publishThrowable: function(replyToMessage, throwable, callback) {
        var message         = this.pubSub.factoryMessage({
            messageType: CallDefines.MessageTypes.CALL_THROWABLE,
            messageData: {
                throwable: throwable
            }
        });
        this.publishResponse(replyToMessage, message, callback);
    },

    /**
     * @param {Message} replyToMessage
     * @param {Object} messageData
     * @param {function(Throwable, number=)} callback
     */
    publishResponse: function(replyToMessage, messageData, callback) {
        this.pubSub.publishResponse(replyToMessage, messageData, callback);
    },

    /**
     * @param {string} callUuid
     * @param {function(Message)} subscriberFunction
     * @param {Object} subscriberContext
     * @param {function(Throwable=)} callback
     */
    subscribeToCallRequestsForCall: function(callUuid, subscriberFunction, subscriberContext, callback) {
        var channel = this.generateCallRequestChannel(callUuid);
        this.pubSub.subscribe(channel, subscriberFunction, subscriberContext, callback);
    },

    /**
     * @param {string} callUuid
     * @param {function(Message)} subscriberFunction
     * @param {Object} subscriberContext
     * @param {function(Throwable=)} callback
     */
    unsubscribeFromCallRequestsForCall: function(callUuid, subscriberFunction, subscriberContext, callback) {
        var channel = this.generateCallRequestChannel(callUuid);
        this.pubSub.unsubscribe(channel, subscriberFunction, subscriberContext, callback);
    },


    //-------------------------------------------------------------------------------
    // Protected Methods
    //-------------------------------------------------------------------------------

    /**
     * @protected
     * @param {string} callUuid
     * @return {string}
     */
    generateCallRequestChannel: function(callUuid) {
        return "callRequestChannel:" + callUuid;
    }
});


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(CallRequestPublisher).with(
    module("callRequestPublisher")
        .args([
            arg().ref("logger"),
            arg().ref("callManager"),
            arg().ref("callRequestManager"),
            arg().ref("callRequestFactory"),
            arg().ref("callResponseHandlerFactory"),
            arg().ref("pubSub")
        ])
);


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export('bugcall.CallRequestPublisher', CallRequestPublisher);
