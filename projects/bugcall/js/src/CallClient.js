//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugcall')

//@Export('CallClient')

//@Require('Class')
//@Require('EventDispatcher')
//@Require('bugcall.CallConnection')
//@Require('bugcall.CallClientConnection')
//@Require('bugcall.CallClientEvent')
//@Require('socketio:client.SocketIoClient')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var EventDispatcher         = bugpack.require('EventDispatcher');
var CallClientConnection    = bugpack.require('bugcall.CallClientConnection');
var CallClientEvent         = bugpack.require('bugcall.CallClientEvent');
var CallConnection          = bugpack.require('bugcall.CallConnection');
var SocketIoClient          = bugpack.require('socketio:client.SocketIoClient');


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

    _constructor: function(socketIoClient) {

        this._super();

        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {CallConnection}
         */
        this.callConnection = null;

        /**
         * @private
         * @type {boolean}
         */
        this.connected = false;

        /**
         * @private
         * @type {boolean}
         */
        this.connecting = false;

        /**
         * @private
         * @type {boolean}
         */
        this.initialized = false;

        /**
         * @private
         * @type {number}
         */
        this.retryAttempts = 0;

        /**
         * @private
         * @type {number}
         */
        this.retryLimit = 3;

        /**
         * @private
         * @type {SocketIoClient}
         */
        this.socketIoClient = socketIoClient;

        this.initialize();
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

    /**
     * @return {boolean}
     */
    isConnected: function() {
        return this.connected;
    },

    /**
     * @return {boolean}
     */
    isConnecting: function() {
        return this.connecting;
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
    closeConnection: function() {
        if (this.isConnected()) {
            if (!this.callConnection.isClosing()) {
                this.doCloseConnection();
            }
        }
    },

    /**
     *
     */
    openConnection: function() {
        //TEST
        console.log("CallClient openConnection - isConnected:", this.isConnected() + " isConnecting:", this.isConnecting());

        if (!this.isConnected()) {
            if (!this.isConnecting()) {
                this.retryAttempts = 0;
                this.doOpenConnection();
            }
        }
    },


    //-------------------------------------------------------------------------------
    // Private Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    createConnection: function() {
        if (!this.callConnection) {
            var socketIoConnection = this.socketIoClient.getConnection();
            this.callConnection = new CallClientConnection(socketIoConnection);
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
        this.callConnection.close();
    },

    /**
     * @private
     */
    doOpenConnection: function() {
        this.connecting = true;
        this.socketIoClient.connect();
    },

    /**
     * @private
     */
    handleConnectionClosed: function() {
        this.dispatchConnectionClosed(false);
        this.destroyConnection();
        this.connected = false;
        this.connecting = false;
    },

    /**
     * @private
     */
    handleConnectionFailed: function() {
        this.dispatchConnectionClosed(true);
        this.destroyConnection();
        this.connected = false;
        this.connecting = false;
        this.retryConnect();
    },

    /**
     * @private
     */
    handleConnectionOpened: function() {
        this.createConnection();
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
    initialize: function() {
        if (!this.isInitialized()) {
            this.initialized = true;
            this.socketIoClient.addEventListener(SocketIoClient.EventTypes.CONNECTION, this.hearClientConnection, this);
            this.socketIoClient.addEventListener(SocketIoClient.EventTypes.CONNECT_ERROR, this.hearClientConnectError, this);
            if (this.isConnected()) {
                this.createConnection();
            }
        }
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
            this.handleConnectionOpened();
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
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugcall.CallClient', CallClient);
