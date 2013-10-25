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
        this.closing    = false;

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
         * @type {?string}
         */
        this.querystring = null;

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

    isClosing: function() {
        return this.closing;
    },

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
     * @param {string} querystring
     */
    openConnection: function(querystring) {
        if (!this.isConnected()) {
            if (!this.isConnecting()) {
                this.retryAttempts = 0;
                this.querystring = querystring;
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
    createConnection: function(querystring) {
        console.log("Inside CallClient#createConnection");
        if (!this.callConnection) {
            console.log("CallClient creating connection");
            console.log("socketIoClient:", this.socketIoClient);
            var socketIoConnection  = this.socketIoClient.connect(querystring);
            console.log("socketIoConnection:", socketIoConnection);
            this.callConnection     = new CallClientConnection(socketIoConnection);
            console.log("callConnection:", this.callConnection);
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
            // this.socketIoClient.disconnect();
            this.callConnection.removeAllListeners();
            this.callConnection = null;
            this.connected      = false;
            this.connecting     = false;
            this.disconnecting  = false;
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
        this.disconnecting = true;
        // this.socketIoClient.disconnect();
        this.callConnection.disconect();
    },

    /**
     * @private
     */
    doOpenConnection: function() {
        this.connecting = true;
        this.socketIoClient.connect(this.querystring);
    },

    /**
     * @private
     */
    handleConnectionClosed: function() {
        this.dispatchConnectionClosed(false);
        this.destroyConnection();
        this.connected = false;
        this.connecting = false;
        this.disconnecting = false;
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
        console.log("xoxoxoxoxoxoxoxoxoxoxoxoxoxoxoxoxoxoxox");
        console.log("CallClient#initialize");
        console.log("socketIoClient:", this.socketIoClient);
        if (!this.isInitialized()) {
            this.initialized = true;
            this.socketIoClient.addEventListener(SocketIoClient.EventTypes.CONNECTION, this.hearClientConnection, this);
            this.socketIoClient.addEventListener(SocketIoClient.EventTypes.ERROR, this.hearClientConnectError, this);
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
