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

//@Export('bugcall.BugCallServer')
//@Autoload

//@Require('Class')
//@Require('EventDispatcher')
//@Require('Exception')
//@Require('Map')
//@Require('Proxy')
//@Require('Set')
//@Require('bugcall.Call')
//@Require('bugcall.CallConnection')
//@Require('bugcall.CallEvent')
//@Require('bugcall.CallResponder')
//@Require('bugcall.CallServer')
//@Require('bugioc.ArgTag')
//@Require('bugioc.IInitializingModule')
//@Require('bugioc.ModuleTag')
//@Require('bugmeta.BugMeta')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class                   = bugpack.require('Class');
    var EventDispatcher         = bugpack.require('EventDispatcher');
    var Exception               = bugpack.require('Exception');
    var Map                     = bugpack.require('Map');
    var Proxy                   = bugpack.require('Proxy');
    var Set                     = bugpack.require('Set');
    var Call                    = bugpack.require('bugcall.Call');
    var CallConnection          = bugpack.require('bugcall.CallConnection');
    var CallEvent               = bugpack.require('bugcall.CallEvent');
    var CallResponder           = bugpack.require('bugcall.CallResponder');
    var CallServer              = bugpack.require('bugcall.CallServer');
    var ArgTag                  = bugpack.require('bugioc.ArgTag');
    var IInitializingModule     = bugpack.require('bugioc.IInitializingModule');
    var ModuleTag               = bugpack.require('bugioc.ModuleTag');
    var BugMeta                 = bugpack.require('bugmeta.BugMeta');


    //-------------------------------------------------------------------------------
    // Simplify References
    //-------------------------------------------------------------------------------

    var arg                     = ArgTag.arg;
    var bugmeta                 = BugMeta.context();
    var module                  = ModuleTag.module;


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {EventDispatcher}
     */
    var BugCallServer = Class.extend(EventDispatcher, {

        _name: "bugcall.BugCallServer",


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
        // IInitializingModule Implementation
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
         * @param {string} callType
         * @param {string} callUuid
         * @param {boolean} reconnect
         * @return {Call}
         */
        createCall: function(callType, callUuid, reconnect) {
            return new Call(this.logger, callType, callUuid, reconnect);
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
            var callType        = callConnection.getHandshake().query.callType; //NOTE this is where the callUuid from the query is used
            /** @type {string}*/
            var callUuid        = callConnection.getHandshake().query.callUuid; //NOTE this is where the callUuid from the query is used
            /** @type {boolean} */
            var reconnect       = callConnection.getHandshake().query.reconnect === "true";
            /** @type {Call} */
            var call     = this.getCallForCallUuid(callUuid);
            if (!call) {
                call = this.createCall(callType, callUuid, reconnect);
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

    Class.implement(BugCallServer, IInitializingModule);


    //-------------------------------------------------------------------------------
    // BugMeta
    //-------------------------------------------------------------------------------

    bugmeta.tag(BugCallServer).with(
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
});
