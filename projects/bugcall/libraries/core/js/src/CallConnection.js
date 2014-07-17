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

//@Export('bugcall.CallConnection')

//@Require('Class')
//@Require('Event')
//@Require('EventDispatcher')
//@Require('bugcall.CallRequest')
//@Require('bugcall.CallResponse')
//@Require('socketio.SocketIoConnection')


//-------------------------------------------------------------------------------
// Context
//-------------------------------------------------------------------------------

require('bugpack').context("*", function(bugpack) {

    //-------------------------------------------------------------------------------
    // BugPack
    //-------------------------------------------------------------------------------

    var Class               = bugpack.require('Class');
    var Event               = bugpack.require('Event');
    var EventDispatcher     = bugpack.require('EventDispatcher');
    var CallRequest         = bugpack.require('bugcall.CallRequest');
    var CallResponse        = bugpack.require('bugcall.CallResponse');
    var SocketIoConnection  = bugpack.require('socketio.SocketIoConnection');


    //-------------------------------------------------------------------------------
    // Declare Class
    //-------------------------------------------------------------------------------

    /**
     * @class
     * @extends {EventDispatcher}
     */
    var CallConnection = Class.extend(EventDispatcher, {

        _name: "bugcall.CallConnection",


        //-------------------------------------------------------------------------------
        // Constructor
        //-------------------------------------------------------------------------------

        /**
         * @constructs
         * @param {SocketIoConnection} socketConnection
         * @param {Marshaller} marshaller
         */
        _constructor: function(socketConnection, marshaller) {

            this._super();


            //-------------------------------------------------------------------------------
            // Private Properties
            //-------------------------------------------------------------------------------

            /**
             * @private
             * @type {boolean}
             */
            this.closed             = false;

            /**
             * @private
             * @type {boolean}
             */
            this.closing            = false;

            /**
             * @private
             * @type {boolean}
             */
            this.failed             = false;

            /**
             * @private
             * @type {boolean}
             */
            this.initialized        = false;

            /**
             * @private
             * @type {Marshaller}
             */
            this.marshaller         = marshaller;

            /**
             * @private
             * @type {SocketIoConnection}
             */
            this.socketConnection   = socketConnection;
        },

        /**
         * @private
         */
        _initializer: function() {
            this._super();
            this.initialize();
        },


        //-------------------------------------------------------------------------------
        // Getters and Setters
        //-------------------------------------------------------------------------------

        /**
         * @return {Object}
         */
        getHandshake: function() {
            return this.socketConnection.getSocket().handshake;
        },

        /**
         * @return {Marshaller}
         */
        getMarshaller: function() {
            return this.marshaller;
        },

        /**
         * @return {SocketIoConnection}
         */
        getSocketConnection: function() {
            return this.socketConnection;
        },

        /**
         * @return {boolean}
         */
        isClosed: function() {
            return this.closed;
        },

        /**
         * @return {boolean}
         */
        isClosing: function() {
            return this.closing;
        },

        /**
         * @return {boolean}
         */
        isFailed: function() {
            return this.failed;
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
         *
         */
        disconnect: function() {
            this.doDisconnect();
        },

        /**
         * @param {CallRequest} callRequest
         * @param {function(data)} callback
         */
        sendRequest: function(callRequest, callback) {
            this.socketConnection.emit("callRequest", this.marshaller.marshalData(callRequest), callback);
        },

        /**
         * @param {CallResponse} callResponse
         * @param {function(data)} callback
         */
        sendResponse: function(callResponse, callback) {
            this.socketConnection.emit("callResponse", this.marshaller.marshalData(callResponse), callback);
        },

        /**
         *
         */
        terminate: function() {
            this.doTerminate();
        },


        //-------------------------------------------------------------------------------
        // Protected Methods
        //-------------------------------------------------------------------------------

        /**
         * @private
         */
        changeStateClosed: function() {
            if (!this.isClosed()) {
                this.closed = true;
                this.dispatchEvent(new Event(CallConnection.EventTypes.CLOSED, {
                    failed: false
                }));
            }
        },

        /**
         * @private
         */
        changeStateClosing: function() {
            if (!this.isClosed() && !this.isClosing()) {
                this.closing = true;
                this.dispatchEvent(new Event(CallConnection.EventTypes.CLOSING));
            }
        },

        /**
         * @private
         */
        changeStateFailed: function() {
            if (!this.isClosed() && !this.isFailed()) {
                this.failed = true;
                this.dispatchEvent(new Event(CallConnection.EventTypes.CLOSED, {
                    failed: true
                }));
            }
        },

        //TODO
        clearConnection: function() {
            if (this.socketConnection) {
                this.socketConnection = null;
            }
        },

        /**
         * @private
         */
        doDisconnect: function() {
            if (this.socketConnection) {
                this.changeStateClosing();
                this.socketConnection.disconnect();
            }
        },

        //TODO
        doClose: function() {
            //
            //
            this.closed = true;
        },

        /**
         * @private
         */
        deinitialize: function() {
            if (this.isInitialized()) {
                this.initialized = false;
                this.doDeinitialize();
            }
        },

        /**
         * @protected
         */
        doDeinitialize: function() {
            this.socketConnection.removeEventListener(SocketIoConnection.EventTypes.DISCONNECT, this.hearDisconnect, this);
            this.socketConnection.removeEventListener("callRequest",    this.hearCallRequest,   this);
            this.socketConnection.removeEventListener("callResponse",   this.hearCallResponse,  this);
        },

        /**
         * @protected
         */
        doInitialize: function() {
            this.socketConnection.addEventListener(SocketIoConnection.EventTypes.DISCONNECT, this.hearDisconnect, this);
            this.socketConnection.addEventListener("callRequest",   this.hearCallRequest,   this);
            this.socketConnection.addEventListener("callResponse",  this.hearCallResponse,  this);
        },

        /**
         * @protected
         */
        doTerminate: function() {
            if (this.socketConnection) {
                this.changeStateClosing();
                this.socketConnection.terminate();
            }
        },

        /**
         * @private
         */
        initialize: function() {
            if (!this.isInitialized()) {
                this.initialized = true;
                this.doInitialize();
            }
        },


        //-------------------------------------------------------------------------------
        // Event Listeners
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @param {NodeJsEvent} event
         */
        hearCallRequest: function(event) {
            var callRequestData = event.getArguments()[0];

            if (callRequestData) {
                var callRequest     = this.marshaller.unmarshalData(callRequestData);
                this.dispatchEvent(new Event(CallConnection.EventTypes.REQUEST, {
                    callRequest: callRequest
                }));
            } else {
                throw new Error("Incompatible request received");
            }
        },

        /**
         * @private
         * @param {NodeJsEvent} event
         */
        hearCallResponse: function(event) {
            var callResponseData = event.getArguments()[0];
            if (callResponseData) {
                var callResponse = this.marshaller.unmarshalData(callResponseData);
                this.dispatchEvent(new Event(CallConnection.EventTypes.RESPONSE, {
                    callResponse: callResponse
                }));
            } else {
                throw new Error("Incompatible response received");
            }
        },

        /**
         * @private
         * @param {NodeJsEvent} event
         */
        hearDisconnect: function(event) {
            if (this.isClosing()) {
                this.changeStateClosed();
            } else {
                this.changeStateFailed();
            }
            this.deinitialize();
        }
    });


    //-------------------------------------------------------------------------------
    // Static Properties
    //-------------------------------------------------------------------------------

    /**
     * @static
     * @enum {string}
     */
    CallConnection.EventTypes = {
        CLOSING:    "CallConnection:Closing",
        CLOSED:     "CallConnection:Closed",
        REQUEST:    "CallConnection:Request",
        RESPONSE:   "CallConnection:Response"
    };


    //-------------------------------------------------------------------------------
    // Export
    //-------------------------------------------------------------------------------

    bugpack.export('bugcall.CallConnection', CallConnection);
});
