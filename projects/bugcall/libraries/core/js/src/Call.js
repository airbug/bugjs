/*
 * Copyright (c) 2014 airbug Inc. All rights reserved.
 *
 * All software, both binary and source contained in this work is the exclusive property
 * of airbug Inc. Modification, decompilation, disassembly, or any other means of discovering
 * the source code of this software is prohibited. This work is protected under the United
 * States copyright law and other international copyright treaties and conventions.
 */


//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugcall.Call')

//@Require('Bug')
//@Require('Class')
//@Require('EventDispatcher')
//@Require('Exception')
//@Require('Flows')
//@Require('Map')
//@Require('Queue')
//@Require('Set')
//@Require('TypeUtil')
//@Require('bugcall.CallConnection')
//@Require('bugcall.CallDefines')
//@Require('bugcall.CallEvent')
//@Require('bugcall.IncomingRequest')
//@Require('bugcall.IncomingResponse')
//@Require('bugcall.OutgoingRequest')
//@Require('bugcall.OutgoingResponse')
//@Require('bugcall.RequestFailedException')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Bug                     = bugpack.require('Bug');
    var Class                   = bugpack.require('Class');
    var EventDispatcher         = bugpack.require('EventDispatcher');
    var Exception               = bugpack.require('Exception');
    var Flows                   = bugpack.require('Flows');
    var Map                     = bugpack.require('Map');
    var Queue                   = bugpack.require('Queue');
    var Set                     = bugpack.require('Set');
    var TypeUtil                = bugpack.require('TypeUtil');
    var CallConnection          = bugpack.require('bugcall.CallConnection');
    var CallDefines             = bugpack.require('bugcall.CallDefines');
    var CallEvent               = bugpack.require('bugcall.CallEvent');
    var IncomingRequest         = bugpack.require('bugcall.IncomingRequest');
    var IncomingResponse        = bugpack.require('bugcall.IncomingResponse');
    var OutgoingRequest         = bugpack.require('bugcall.OutgoingRequest');
    var OutgoingResponse        = bugpack.require('bugcall.OutgoingResponse');
    var RequestFailedException  = bugpack.require('bugcall.RequestFailedException');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var $task                   = Flows.$task;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {EventDispatcher}
     */
    var Call = Class.extend(EventDispatcher, {

        _name: "bugcall.Call",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {Logger} logger
         * @param {string} callType
         * @param {string=} callUuid
         * @param {boolean=} reconnect
         */
        _constructor: function(logger, callType, callUuid, reconnect) {

            this._super();

            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {CallConnection}
             */
            this.callConnection                     = null;

            /**
             * @private
             * @type {CallDefines.CallState}
             */
            this.callState                          = CallDefines.CallState.STOPPED;

            /**
             * @private
             * @type {string}
             */
            this.callType                           = callType;

            /**
             * @private
             * @type {string}
             */
            this.callUuid                           = callUuid || "";

            /**
             * @private
             * @type {CallDefines.ConnectionState}
             */
            this.connectionState                    = CallDefines.ConnectionState.CLOSED;

            /**
             * @private
             * @type {Object}
             */
            this.handshake                          = null;

            /**
             * @private
             * @type {Queue.<OutgoingRequest>}
             */
            this.incomingRequestQueue               = new Queue();

            /**
             * @private
             * @type {Queue.<OutgoingResponse>}
             */
            this.incomingResponseQueue              = new Queue();

            /**
             * @private
             * @type {Logger}
             */
            this.logger                             = logger;

            /**
             * @private
             * @type {Queue.<OutgoingRequest>}
             */
            this.outgoingRequestQueue               = new Queue();

            /**
             * @private
             * @type {Queue.<OutgoingResponse>}
             */
            this.outgoingResponseQueue              = new Queue();

            /**
             * @private
             * @type {Map.<string, IncomingRequest>}
             */
            this.pendingIncomingRequestMap          = new Map();

            /**
             * @private
             * @type {Map.<string, OutgoingRequest>}
             */
            this.pendingOutgoingRequestMap          = new Map();

            /**
             * @private
             * @type {boolean}
             */
            this.reconnect                          = reconnect || false;

            /**
             * @private
             * @type {Map.<string, CallResponseHandler>}
             */
            this.requestUuidToResponseHandlerMap    = new Map();
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {CallDefines.CallState}
         */
        getCallState: function() {
            return this.callState;
        },

        /**
         * @return {string}
         */
        getCallType: function() {
            return this.callType;
        },

        /**
         * @return {string}
         */
        getCallUuid: function() {
            return this.callUuid;
        },

        /**
         * @param {string} callUuid
         */
        setCallUuid: function(callUuid) {
            this.callUuid = callUuid;
        },

        /**
         * @return {CallConnection}
         */
        getConnection: function() {
            return this.callConnection;
        },

        /**
         * @return {CallDefines.ConnectionState}
         */
        getConnectionState: function() {
            return this.connectionState;
        },

        /**
         * @return {Object}
         */
        getHandshake: function() {
            return this.handshake;
        },

        /**
         * @return {Queue.<OutgoingRequest>}
         */
        getOutgoingRequestQueue: function() {
            return this.outgoingRequestQueue;
        },

        /**
         * @return {Map.<string, OutgoingRequest>}
         */
        getPendingIncomingRequestMap: function() {
            return this.pendingIncomingRequestMap;
        },

        /**
         * @return {Map.<string, OutgoingRequest>}
         */
        getPendingOutgoingRequestMap: function() {
            return this.pendingOutgoingRequestMap;
        },


        //-------------------------------------------------------------------------------
        // Convenience Methods
        //-------------------------------------------------------------------------------

        /**
         * @return {boolean}
         */
        hasConnection: function() {
            return !!(this.callConnection);
        },

        /**
         * @return {boolean}
         */
        isClosed: function() {
            return this.connectionState === CallDefines.ConnectionState.CLOSED;
        },

        /**
         * @return {boolean}
         */
        isOpen: function() {
            return this.connectionState === CallDefines.ConnectionState.OPEN;
        },

        /**
         * @return {boolean}
         */
        isReconnect: function() {
            return this.reconnect;
        },

        /**
         * @return {boolean}
         */
        isStarted: function() {
            return this.callState === CallDefines.CallState.STARTED;
        },

        /**
         * @return {boolean}
         */
        isStopped: function() {
            return this.callState === CallDefines.CallState.STOPPED;
        },

        /**
         * @return {boolean}
         */
        isStopping: function() {
            return this.callState === CallDefines.CallState.STOPPING;
        },


        //-------------------------------------------------------------------------------
        // Public Methods
        //-------------------------------------------------------------------------------

        /**
         * @param {CallRequest} callRequest
         * @param {CallResponseHandler} callResponseHandler
         * @param {function(Throwable, OutgoingRequest=)} callback
         */
        sendRequest: function(callRequest, callResponseHandler, callback) {
            var _this               = this;
            var outgoingRequest     = new OutgoingRequest(callRequest);
            this.requestUuidToResponseHandlerMap.put(callRequest.getUuid(), callResponseHandler);
            $task(function(flow) {
                _this.sendOutgoingRequest(outgoingRequest, function(throwable) {
                    flow.complete(throwable);
                });
            }).execute(function(throwable) {
                if (!throwable) {
                    callback(null, outgoingRequest);
                } else {
                    callback(throwable);
                }
            });
        },

        /**
         * @param {CallResponse} callResponse
         * @param {function(Throwable, OutgoingResponse=)} callback
         */
        sendResponse: function(callResponse, callback) {
            var _this               = this;
            var outgoingResponse    = new OutgoingResponse(callResponse);
            $task(function(flow) {
                _this.sendOutgoingResponse(outgoingResponse, function(throwable) {
                    flow.complete(throwable);
                });
            }).execute(function(throwable) {
                if (!throwable) {
                    callback(null, outgoingResponse);
                } else {
                    callback(throwable);
                }
            });
        },


        // Connection
        //-------------------------------------------------------------------------------

        /**
         *
         */
        clearConnection: function() {
            if (this.hasConnection()) {
                this.callConnection.removeEventListener(CallConnection.EventTypes.REQUEST,  this.hearCallConnectionRequest, this);
                this.callConnection.removeEventListener(CallConnection.EventTypes.RESPONSE, this.hearCallConnectionResponse, this);
                this.callConnection = null;
            }
        },

        /**
         *
         */
        initializeConnection: function(){
            if (this.hasConnection()) {
                this.callConnection.addEventListener(CallConnection.EventTypes.REQUEST,     this.hearCallConnectionRequest, this);
                this.callConnection.addEventListener(CallConnection.EventTypes.RESPONSE,    this.hearCallConnectionResponse, this);
            }
        },

        /**
         * @param {CallConnection} callConnection
         */
        updateConnection: function(callConnection) {
            if (this.hasConnection()) {
                this.clearConnection();
            }
            this.callConnection     = callConnection;
            this.handshake          = callConnection.getHandshake();
            this.initializeConnection();
        },


        // Call
        //-------------------------------------------------------------------------------

        /**
         *
         */
        closeCall: function() {
            var _this = this;
            if (this.isOpen()) {
                this.connectionState = CallDefines.ConnectionState.CLOSED;
                this.clearConnection();
                this.pendingOutgoingRequestMap.forEach(function(outgoingRequest) {
                    _this.doFailOutgoingRequest(outgoingRequest);
                });
                this.dispatchConnectionClosed(false);
            }
        },

        /**
         *
         */
        failCall: function() {
            //TODO BRN: For now we assume that there is no way to reconnect and receive a response to an open request.
            // Any number of things could have gone wrong here
            // 1) The server could have gone down
            // 2) The client's connection could be having problems.
            // We send an error to all open requests and let the application logic determine what to do with an incomplete request.

            var _this = this;
            if (this.isOpen()) {
                this.connectionState = CallDefines.ConnectionState.CLOSED;
                this.clearConnection();
                this.pendingOutgoingRequestMap.forEach(function(outgoingRequest) {
                    _this.doFailOutgoingRequest(outgoingRequest);
                });
                this.dispatchConnectionClosed(true);
            }
        },

        /**
         * @param {CallConnection=} callConnection
         */
        openCall: function(callConnection) {
            if (!this.isOpen()) {
                this.connectionState = CallDefines.ConnectionState.OPEN;
                if (callConnection) {
                    this.updateConnection(callConnection);
                }
                this.dispatchConnectionOpened();
            }
        },

        /**
         *
         */
        resetCall: function() {
            this.callUuid = null;
            this.reconnect = false;
        },

        /**
         *
         */
        startCall: function() {
            if (this.isStopped()) {
                this.doCallStarted();
            }
        },

        /**
         *
         */
        stopCall: function() {
            if (this.isStarted()) {
                this.doCallStopping();
                this.checkForStopped();
            }
        },


        //-------------------------------------------------------------------------------
        // Protected Methods
        //-------------------------------------------------------------------------------

        /**
         * @protected
         */
        doCallStarted: function() {
            this.callState = CallDefines.CallState.STARTED;
            this.dispatchCallStarted();
            this.processOutgoingRequestQueue();
            this.processOutgoingResponseQueue();
            this.processIncomingRequestQueue();
            this.processIncomingResponseQueue();
        },

        /**
         * @protected
         */
        doCallStopped: function() {
            this.callState = CallDefines.CallState.STOPPED;
            this.dispatchCallStopped();
        },

        /**
         * @protected
         */
        doCallStopping: function() {
            this.callState = CallDefines.CallState.STOPPING;
            this.dispatchCallStopping();
        },

        /**
         * @protected
         * @param {OutgoingRequest} outgoingRequest
         * @param {function(Throwable=)} callback
         */
        sendOutgoingRequest: function(outgoingRequest, callback) {
            if (!this.pendingOutgoingRequestMap.containsValue(outgoingRequest)) {
                this.pendingOutgoingRequestMap.put(outgoingRequest.getUuid(), outgoingRequest);
                if (this.isOpen() && this.isStarted()) {
                    this.doSendOutgoingRequest(outgoingRequest, callback);
                } else {
                    this.doQueueOutgoingRequest(outgoingRequest, callback);
                }
            } else {
                callback(new Bug("IllegalState", {}, "Cannot submit the same request more than once"));
            }
        },

        /**
         * @protected
         * @param {OutgoingResponse} outgoingResponse
         * @param {function(Throwable=)} callback
         */
        sendOutgoingResponse: function(outgoingResponse, callback) {
            var requestUuid         = outgoingResponse.getRequestUuid();
            if (this.pendingIncomingRequestMap.containsKey(requestUuid)) {
                if (this.isOpen() && !this.isStopped()) {
                    this.doSendOutgoingResponse(outgoingResponse, callback);
                } else {
                    this.doQueueOutgoingResponse(outgoingResponse, callback);
                }
            } else {
                callback(new Bug("IllegalState", {}, "There is no request pending with the uuid:" + requestUuid + ". " +
                    "This request may have already been responded to."));
            }
        },


        //-------------------------------------------------------------------------------
        // Private Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         */
        checkForStopped: function() {
            if (this.isStopping()) {
                if (this.pendingIncomingRequestMap.isEmpty() && this.pendingOutgoingRequestMap.isEmpty()) {
                    this.doCallStopped();
                }
            }
        },

        /**
         * @private
         * @param {string} requestUuid
         * @param {Exception} exception
         * @param {IncomingResponse} incomingResponse
         */
        routeResponse: function(requestUuid, exception, incomingResponse) {
            var callResponseHandler = this.requestUuidToResponseHandlerMap.get(requestUuid);
            if (!exception) {
                callResponseHandler.handle(null, incomingResponse.getCallResponse());
            } else {
                callResponseHandler.handle(exception, null);
            }
            this.requestUuidToResponseHandlerMap.remove(requestUuid);
        },

        /**
         * @private
         * @param {boolean} failed
         */
        dispatchConnectionClosed: function(failed) {
            this.dispatchEvent(new CallEvent(CallEvent.CLOSED, {
                call: this,
                failed: failed
            }));
        },

        /**
         * @private
         */
        dispatchConnectionOpened: function() {
            this.dispatchEvent(new CallEvent(CallEvent.OPENED, {
                call: this
            }));
        },

        /**
         * @private
         */
        dispatchCallStarted: function() {
            this.dispatchEvent(new CallEvent(CallEvent.STARTED, {
                call: this
            }));
        },

        /**
         * @private
         */
        dispatchCallStopped: function() {
            this.dispatchEvent(new CallEvent(CallEvent.STOPPED, {
                call: this
            }));
        },

        /**
         * @private
         */
        dispatchCallStopping: function() {
            this.dispatchEvent(new CallEvent(CallEvent.STOPPING, {
                call: this
            }));
        },

        /**
         * @private
         * @param {OutgoingRequest} outgoingRequest
         */
        doFailOutgoingRequest: function(outgoingRequest) {
            this.pendingOutgoingRequestMap.remove(outgoingRequest);
            /** @type {CallRequest} */
            var callRequest = outgoingRequest.getCallRequest();
            this.routeResponse(callRequest.getUuid(), new RequestFailedException(callRequest), null);
            this.dispatchEvent(new CallEvent(CallEvent.REQUEST_FAILED, {
                outgoingRequest: outgoingRequest
            }));
        },

        /**
         * @private
         * @param {IncomingRequest} incomingRequest
         */
        doProcessIncomingRequest: function(incomingRequest) {
            var requestUuid = incomingRequest.getUuid();
            this.pendingIncomingRequestMap.put(requestUuid, incomingRequest);
            this.dispatchEvent(new CallEvent(CallEvent.INCOMING_REQUEST, {
                incomingRequest: incomingRequest
            }));
        },

        /**
         * @private
         * @param {IncomingResponse} incomingResponse
         */
        doProcessIncomingResponse: function(incomingResponse) {
            var requestUuid     = incomingResponse.getRequestUuid();
            var outgoingRequest = this.pendingOutgoingRequestMap.get(requestUuid);
            if (outgoingRequest) {
                this.pendingOutgoingRequestMap.remove(requestUuid);
                this.routeResponse(requestUuid, null, incomingResponse);
                this.checkForStopped();
            } else {
                //NOTE BRN: This could happen if a call closes shortly after it sends a response
                throw new Exception("IllegalState", {}, "Could not find outgoingRequest for this incomingResponse. IncomingResponse:" + incomingResponse.toObject());
            }
        },

        /**
         * @private
         * @param {IncomingRequest} incomingRequest
         */
        doQueueIncomingRequest: function(incomingRequest) {
            this.incomingRequestQueue.enqueue(incomingRequest);
        },

        /**
         * @private
         * @param {IncomingResponse} incomingResponse
         */
        doQueueIncomingResponse: function(incomingResponse) {
            this.incomingResponseQueue.enqueue(incomingResponse);
        },

        /**
         * @private
         * @param {OutgoingRequest} outgoingRequest
         * @param {function(Throwable=)} callback
         */
        doQueueOutgoingRequest: function(outgoingRequest, callback) {
            var _this = this;
            $task(function(flow) {
                _this.outgoingRequestQueue.enqueue(outgoingRequest);
                outgoingRequest.changeStateQueued();
                flow.complete();
            }).execute(callback);
        },

        /**
         * @private
         * @param {OutgoingResponse} outgoingResponse
         * @param {function(Throwable=)} callback
         */
        doQueueOutgoingResponse: function(outgoingResponse, callback) {
            var _this = this;
            $task(function(flow) {
                _this.outgoingResponseQueue.enqueue(outgoingResponse);
                outgoingResponse.changeStateQueued();
                flow.complete();
            }).execute(callback);
        },

        /**
         * @private
         * @param {OutgoingRequest} outgoingRequest
         * @param {function(Throwable=)} callback
         */
        doSendOutgoingRequest: function(outgoingRequest, callback) {
            var _this = this;
            $task(function(flow) {
                _this.callConnection.sendRequest(outgoingRequest.getCallRequest(), function(data) {
                    outgoingRequest.changeStateSent();
                    flow.complete();
                });
            }).execute(callback);
        },

        /**
         * @private
         * @param {OutgoingResponse} outgoingResponse
         * @param {function(Throwable=)} callback
         */
        doSendOutgoingResponse: function(outgoingResponse, callback) {
            var _this = this;
            $task(function(flow) {
                _this.callConnection.sendResponse(outgoingResponse.getCallResponse(), function(data) {
                    var requestUuid = outgoingResponse.getRequestUuid();
                    _this.pendingIncomingRequestMap.remove(requestUuid);
                    _this.checkForStopped();
                    outgoingResponse.changeStateSent();
                    flow.complete();
                });
            }).execute(callback);
        },

        /**
         * @private
         * @param {IncomingRequest} incomingRequest
         */
        processIncomingRequest: function(incomingRequest) {
            if (this.isOpen()) {
                if (!this.isStopped()) {
                    this.doProcessIncomingRequest(incomingRequest);
                } else {
                    this.doQueueIncomingRequest(incomingRequest);
                }
            } else {
                throw new Bug("IllegalState" , {}, "Received a Request when the call was closed. This should not be possible.");
            }
        },

        /**
         * @private
         * @param {IncomingResponse} incomingResponse
         */
        processIncomingResponse: function(incomingResponse) {
            if (this.isOpen()) {
                if (!this.isStopped()) {
                    this.doProcessIncomingResponse(incomingResponse);
                } else {
                    this.doQueueIncomingResponse(incomingResponse);
                }
            } else {
                throw new Bug("IllegalState" , {}, "Received a response when the call was closed. This should not be possible.");
            }
        },

        /**
         * @private
         */
        processIncomingRequestQueue: function() {
            while (!this.incomingRequestQueue.isEmpty()) {
                var incomingRequest = this.incomingRequestQueue.dequeue();
                this.doProcessIncomingRequest(incomingRequest);
            }
        },

        /**
         * @private
         */
        processIncomingResponseQueue: function() {
            while (!this.incomingResponseQueue.isEmpty()) {
                var incomingResponse = this.incomingResponseQueue.dequeue();
                this.doProcessIncomingResponse(incomingResponse);
            }
        },

        /**
         * @private
         */
        processOutgoingRequestQueue: function() {
            var _this = this;
            while (!this.outgoingRequestQueue.isEmpty()) {
                var outgoingRequest = this.outgoingRequestQueue.dequeue();
                this.doSendOutgoingRequest(outgoingRequest, function(throwable) {

                    //TODO BRN: Might want to requeue this request if something goes wrong

                    if (throwable) {
                        _this.logger.error(throwable);
                    }
                });
            }
        },

        /**
         * @private
         */
        processOutgoingResponseQueue: function() {
            var _this = this;
            while (!this.outgoingResponseQueue.isEmpty()) {
                var outgoingResponse = this.outgoingResponseQueue.dequeue();
                this.doSendOutgoingResponse(outgoingResponse, function(throwable) {

                    //TODO BRN: Might want to requeue this response if something goes wrong

                    if (throwable) {
                        _this.logger.error(throwable);
                    }
                });
            }
        },


        //-------------------------------------------------------------------------------
        // Event Listeners
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {Event} event
         */
        hearCallConnectionRequest: function(event) {
            var callRequest = event.getData().callRequest;
            if (callRequest) {
                var incomingRequest = new IncomingRequest(callRequest, this);
                try {
                    this.processIncomingRequest(incomingRequest);
                } catch(throwable) {
                    if (Class.doesExtend(throwable, Exception)) {
                        this.logger.warn(throwable);
                    } else {
                        throw throwable;
                    }
                }
            } else {
                throw new Bug("IllegalState", {}, "Incompatible request");
            }

        },

        /**
         * @private
         * @param {Event} event
         */
        hearCallConnectionResponse: function(event) {
            var callResponse = event.getData().callResponse;
            if (callResponse) {
                var incomingResponse = new IncomingResponse(callResponse, this);
                try {
                    this.processIncomingResponse(incomingResponse);
                } catch(throwable) {
                    if (Class.doesExtend(throwable, Exception)) {
                        this.logger.warn(throwable);
                    } else {
                        throw throwable;
                    }
                }
            } else {
                throw new Bug("IllegalState", {}, "Incompatible response");
            }
        }
    });


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('bugcall.Call', Call);
});
