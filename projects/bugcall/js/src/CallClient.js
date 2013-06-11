//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('bugcall')

//@Export('CallClient')

//@Require('Class')
//@Require('EventDispatcher')
//@Require('bugcall.CallConnection')
//@Require('bugcall.CallClientConnection')
//@Require('bugcall.CallManager')
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
var CallConnection          = bugpack.require('bugcall.CallConnection');
var CallManager             = bugpack.require('bugcall.CallManager');
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
        return this.socketIoClient.isConnected;
    },

    /**
     * @return {boolean}
     */
    isConnecting: function() {
        return this.socketIoClient.isConnecting;
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
        if (!this.isConnected()) {
            if (!this.isConnecting()) {
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
        this.dispatchEvent(new Event(CallClient.EventTypes.CONNECTION_CLOSED, {
            callConnection: this.callConnection,
            failed: failed
        }));
    },

    /**
     * @private
     */
    dispatchConnectionOpened: function() {
        this.dispatchEvent(new Event(CallClient.EventTypes.CONNECTION_OPENED, {
            callConnection: this.callConnection
        }));
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
        this.socketIoClient.connect();
    },

    /**
     * @private
     */
    handleConnectionClosed: function() {
        this.retryAttempts = 0;
        this.dispatchConnectionClosed(false);
        this.destroyConnection();
    },

    /**
     * @private
     */
    handleConnectionFailed: function() {
        this.retryAttempts = 0;
        this.dispatchConnectionClosed(true);
        this.destroyConnection();
    },

    /**
     * @private
     */
    handleConnectionOpened: function() {
        this.retryAttempts = 0;
        this.createConnection();
        this.dispatchConnectionOpened();
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
            this.connect();
        } else {
            this.handleConnectionFailed();
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
            console.warn("New connection received when a connection already existed...");
            this.destroyConnection();
        }
        this.handleConnectionOpened();
    },

    /**
     * @private
     * @param {Event} event
     */
    hearConnectionClosed: function(event) {
        if (event.getData().failed) {
            this.destroyConnection();
            this.retryConnect();
        } else {
            this.handleConnectionClosed();
        }
    }
});


//-------------------------------------------------------------------------------
// Static Variables
//-------------------------------------------------------------------------------

/**
 * @enum {string}
 */
CallClient.EventTypes = {
    CONNECTION_CLOSED: "CallClient:ConnectionClosed",
    CONNECTION_OPENED: "CallClient:ConnectionOpened"
};


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('bugcall.CallClient', CallClient);
