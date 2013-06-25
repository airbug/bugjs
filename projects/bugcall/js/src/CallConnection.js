//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugcall')

//@Export('CallConnection')

//@Require('Class')
//@Require('Event')
//@Require('EventDispatcher')
//@Require('Map')
//@Require('UuidGenerator')
//@Require('bugcall.CallRequest')
//@Require('bugcall.CallResponse')
//@Require('socketio:socket.SocketIoConnection')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Event                   = bugpack.require('Event');
var EventDispatcher         = bugpack.require('EventDispatcher');
var CallRequest             = bugpack.require('bugcall.CallRequest');
var CallResponse            = bugpack.require('bugcall.CallResponse');
var SocketIoConnection      = bugpack.require('socketio:socket.SocketIoConnection');
var UuidGenerator           = bugpack.require('UuidGenerator');



//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {Obj}
 */
var CallConnection = Class.extend(EventDispatcher, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(socketConnection) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
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
         * @type {SocketIoConnection}
         */
        this.socketConnection   = socketConnection;

        /**
         * @private
         * @type {string}
         */
        this.uuid               = UuidGenerator.generateUuid();

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
     * @return {SocketIoConnection}
     */
    getSocketConnection: function() {
        return this.socketConnection;
    },

    /**
     * @return {string}
     */
    getSocketConnectionUuid: function() {
        return this.socketConnection.getUuid();
    },

    /**
     * @return {string}
     */
    getUuid: function(){
        return this.uuid;
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
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    close: function() {
        if (!this.closing) {
            this.changeStateClosing();
            this.doClose();
        }
    },

    /**
     * @param {CallRequest} callRequest
     */
    sendRequest: function(callRequest) {
        console.log("CallConnection sending request");
        this.socketConnection.emit("callRequest", callRequest.toObject());
    },

    /**
     * @param {CallResponse} callResponse
     */
    sendResponse: function(callResponse) {
        console.log("CallConnection sending response");
        this.socketConnection.emit("callResponse", callResponse.toObject());
    },


    //-------------------------------------------------------------------------------
    // Private Instance Methods
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
        console.log("CallConnection#doDeInitialize");
        this.socketConnection.removeEventListener(SocketIoConnection.EventTypes.DISCONNECT, this.hearDisconnect, this);
        this.socketConnection.removeEventListener("callRequest",    this.hearCallRequest,   this);
        this.socketConnection.removeEventListener("callResponse",   this.hearCallResponse,  this);
    },

    /**
     * @protected
     */
    doInitialize: function() {
        console.log("**********************************************************************");
        console.log("CallConnection#doInitialize");
        this.socketConnection.addEventListener(SocketIoConnection.EventTypes.DISCONNECT, this.hearDisconnect, this);
        this.socketConnection.addEventListener("callRequest",   this.hearCallRequest,   this);
        this.socketConnection.addEventListener("callResponse",  this.hearCallResponse,  this);
    },

    /**
     * @private
     */
    initialize: function() {
        if (!this.isInitialized()) {
            this.initialized = true;
            this.doInitialize();
            console.log("CallConnection initialized")
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
        console.log("CallConnection hearCallRequest");
        var callRequestObject = event.getArguments()[0];
        console.log("CallRequestObject:", callRequestObject);

        if (callRequestObject) {
            var callRequest     = new CallRequest(callRequestObject.type, callRequestObject.data);
            callRequest.uuid    = callRequestObject.uuid;
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
        console.log("CallConnection hearCallResponse");
        var callResponseObject = event.getArguments()[0];
        console.log("CallResponseObject:", callResponseObject);

        if (callResponseObject) {
            var callResponse = new CallResponse(callResponseObject.type, callResponseObject.data, callResponseObject.requestUuid);
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
// Static Variables
//-------------------------------------------------------------------------------

/**
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
