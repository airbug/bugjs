//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('bugcall.CallClient')
//@Autoload

//@Require('Class')
//@Require('EventDispatcher')
//@Require('bugcall.CallConnection')
//@Require('bugcall.CallClientConnection')
//@Require('bugcall.CallClientEvent')
//@Require('bugcall.CallDefines')
//@Require('bugioc.ArgAnnotation')
//@Require('bugioc.IInitializeModule')
//@Require('bugioc.ModuleAnnotation')
//@Require('bugmeta.BugMeta')
//@Require('socketio:client.SocketIoClient')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                     = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var EventDispatcher             = bugpack.require('EventDispatcher');
var CallClientConnection        = bugpack.require('bugcall.CallClientConnection');
var CallClientEvent             = bugpack.require('bugcall.CallClientEvent');
var CallConnection              = bugpack.require('bugcall.CallConnection');
var CallDefines                 = bugpack.require('bugcall.CallDefines');
var ArgAnnotation               = bugpack.require('bugioc.ArgAnnotation');
var IInitializeModule           = bugpack.require('bugioc.IInitializeModule');
var ModuleAnnotation            = bugpack.require('bugioc.ModuleAnnotation');
var BugMeta                     = bugpack.require('bugmeta.BugMeta');
var SocketIoClient              = bugpack.require('socketio:client.SocketIoClient');


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
var CallClient = Class.extend(EventDispatcher, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(socketIoClient, marshaller) {

        this._super();

        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CallConnection}
         */
        this.callConnection         = null;

        /**
         * @private
         * @type {boolean}
         */
        this.connectedOnce          = false;

        /**
         * @private
         * @type {CallDefines.ConnectionState}
         */
        this.connectionState        = CallDefines.ConnectionState.CLOSED;

        /**
         * @private
         * @type {boolean}
         */
        this.initialized            = false;

        /**
         * @private
         * @type {Marshaller}
         */
        this.marshaller             = marshaller;

        /**
         * @private
         * @type {?string}
         */
        this.querystring            = null;

        /**
         * @private
         * @type {number}
         */
        this.retryAttempts          = 0;

        /**
         * @private
         * @type {number}
         */
        this.retryLimit             = 3;

        /**
         * @private
         * @type {SocketIoClient}
         */
        this.socketIoClient         = socketIoClient;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {CallConnection}
     */
    getConnection: function() {
        return this.callConnection;
    },


    //-------------------------------------------------------------------------------
    // Convenience Methods
    //-------------------------------------------------------------------------------

    /**
     * @return {boolean}
     */
    hasConnectedOnce: function() {
        return this.connectedOnce;
    },

    /**
     * @return {boolean}
     */
    isConnectionClosed: function() {
        return this.connectionState === CallDefines.ConnectionState.CLOSED;
    },

    /**
     * @return {boolean}
     */
    isConnectionClosing: function() {
        return this.connectionState === CallDefines.ConnectionState.CLOSING;
    },

    /**
     * @return {boolean}
     */
    isConnectionOpen: function() {
        return this.connectionState === CallDefines.ConnectionState.OPEN;
    },

    /**
     * @return {boolean}
     */
    isConnectionOpening: function() {
        return this.connectionState === CallDefines.ConnectionState.OPENING;
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
            this.socketIoClient.removeEventListener(SocketIoClient.EventTypes.CONNECTION, this.hearClientConnection, this);
            this.socketIoClient.removeEventListener(SocketIoClient.EventTypes.ERROR, this.hearClientConnectError, this);
        }
        callback();
    },

    /**
     * @param {function(Throwable=)} callback
     */
    initializeModule: function(callback) {
        if (!this.isInitialized()) {
            this.initialized = true;
            this.socketIoClient.addEventListener(SocketIoClient.EventTypes.CONNECTION, this.hearClientConnection, this);
            this.socketIoClient.addEventListener(SocketIoClient.EventTypes.ERROR, this.hearClientConnectError, this);
        }
        callback();
    },


    //-------------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    closeConnection: function() {
        if (!this.isConnectionClosed()) {
            if (!this.isConnectionClosing()) {
                this.doCloseConnection();
            }
        }
    },

    /**
     * @param {string} querystring
     */
    openConnection: function(querystring) {
        if (!this.isConnectionOpen()) {
            if (!this.isConnectionOpening()) {
                this.retryAttempts = 0;
                this.querystring = querystring;
                if (this.hasConnectedOnce()) {
                    this.querystring += "&reconnect=true"
                } else {
                    this.querystring += "&reconnect=false"
                }
                this.doOpenConnection();
            }
        }
    },

    /**
     *
     */
    resetClient: function() {
        this.connectedOnce = false;
    },


    //-------------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {SocketIoConnection} socketConnection
     */
    createConnection: function(socketConnection) {
        if (!this.callConnection) {
            this.callConnection     = new CallClientConnection(socketConnection, this.marshaller);
            this.callConnection.addEventListener(CallConnection.EventTypes.CLOSED, this.hearConnectionClosed, this);
        } else {
            throw new Error("connection already created!");
        }
    },

    /**
     * @private
     */
    destroyConnection: function() {
        if (this.callConnection) {
            this.callConnection.removeAllListeners();
            this.callConnection = null;
            this.connectionState = CallDefines.ConnectionState.CLOSED;
        }
    },

    /**
     * @private
     */
    dispatchConnectionClosed: function(failed) {
        this.dispatchEvent(new CallClientEvent(CallClientEvent.CONNECTION_CLOSED, {
            callConnection: this.callConnection,
            failed: failed
        }));
    },

    /**
     * @private
     */
    dispatchConnectionOpened: function() {
        this.dispatchEvent(new CallClientEvent(CallClientEvent.CONNECTION_OPENED, {
            callConnection: this.callConnection
        }));
    },

    /**
     * @private
     */
    dispatchRetryFailed: function() {
        this.dispatchEvent(new CallClientEvent(CallClientEvent.RETRY_FAILED, {}));
    },

    /**
     * @private
     */
    doCloseConnection: function() {
        this.callConnection.terminate();
    },

    /**
     * @private
     */
    doOpenConnection: function() {
        this.connectionState = CallDefines.ConnectionState.OPENING;
        this.socketIoClient.connect(this.querystring);
    },

    /**
     * @private
     */
    handleConnectionClosed: function() {
        this.connectionState = CallDefines.ConnectionState.CLOSED;
        this.dispatchConnectionClosed(false);
        this.destroyConnection();
    },

    /**
     * @private
     */
    handleConnectionFailed: function() {
        this.connectionState = CallDefines.ConnectionState.CLOSED;
        this.dispatchConnectionClosed(true);
        this.destroyConnection();
        this.retryConnect();
    },

    /**
     * @private
     */
    handleConnectionOpened: function(socketConnection) {
        this.createConnection(socketConnection);
        this.connectionState    = CallDefines.ConnectionState.OPEN;
        this.connectedOnce      = true;
        this.dispatchConnectionOpened();
    },

    /**
     * @private
     */
    handleRetryFailed: function() {
        this.dispatchRetryFailed();
    },

    /**
     * @private
     */
    retryConnect: function() {
        if (this.retryAttempts < this.retryLimit) {
            this.retryAttempts++;
            this.doOpenConnection();
        } else {
            this.handleRetryFailed();
        }
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Event} event
     */
    hearClientConnectError: function(event) {
        this.retryConnect();
    },

    /**
     * @private
     * @param {Event} event
     */
    hearClientConnection: function(event) {
        if (this.callConnection) {
            throw new Error("New connection received when a connection already existed...");
        } else {
            this.handleConnectionOpened(event.getData().connection);
        }
    },

    /**
     * @private
     * @param {Event} event
     */
    hearConnectionClosed: function(event) {
        if (event.getData().failed) {
            this.handleConnectionFailed();
        } else {
            this.handleConnectionClosed();
        }
    }
});


//-------------------------------------------------------------------------------
// Implement Interfaces
//-------------------------------------------------------------------------------

Class.implement(CallClient, IInitializeModule);


//-------------------------------------------------------------------------------
// BugMeta
//-------------------------------------------------------------------------------

bugmeta.annotate(CallClient).with(
    module("callClient")
        .args([
            arg().ref("socketIoClient"),
            arg().ref("marshaller")
        ])
);


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugcall.CallClient', CallClient);
