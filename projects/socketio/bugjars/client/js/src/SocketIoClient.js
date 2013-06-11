//-------------------------------------------------------------------------------
// Requires
//-------------------------------------------------------------------------------

//@Package('socketio:client')

//@Export('SocketIoClient')

//@Require('Class')
//@Require('EventDispatcher')
//@Require('Proxy')
//@Require('Queue')
//@Require('socketio:client.SocketIoEmit')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class           = bugpack.require('Class');
var EventDispatcher = bugpack.require('EventDispatcher');
var Proxy           = bugpack.require('Proxy');
var Queue           = bugpack.require('Queue');
var SocketIoEmit    = bugpack.require('socketio:client.SocketIoEmit');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SocketIoClient = Class.extend(EventDispatcher, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(socketFactory, config) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {SocketIoConfig}
         */
        this.config = config;

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
         * @type {*}
         */
        this.socketConnection = null;

        /**
         * @private
         * @type {ISocketFactory}
         */
        this.socketFactory = socketFactory;
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {SocketIoConnection}
     */
    getConnection: function() {
        return this.socketConnection;
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


    //-------------------------------------------------------------------------------
    // Public Instance Methods
    //-------------------------------------------------------------------------------

    /**
     *
     */
    connect: function() {
        if (!this.isConnected && !this.isConnecting) {
            this.isConnecting = true;
            console.log('SocketIoClient is attempting to connect...');
            if (this.socketIoConnection) {
                this.destroySocket();
            }
            this.createSocket();
        }
    },


    //-------------------------------------------------------------------------------
    // Private Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    createSocket: function() {
        var options = {
            port: this.config.getPort(),
            resource: this.config.getResource(),
            //secure: false,
            //document: 'document' in global ? document : false,
            //transports: io.transports,
            //'connect timeout': 10000,
            //'try multiple transports': true,
            reconnect: false,
            //'reconnection delay': 500,
            //'reconnection limit': Infinity,
            //'reopen delay': 3000,
            //'max reconnection attempts': 10,
            //'sync disconnect on unload': false,
            //'auto connect': true,
            //'flash policy port': 10843,
            //'manualFlush': false,
            'force new connection': true
        };
        this.socketIoConnection = this.socketFactory.createSocketConnection(this.config.getHost(), options);
        this.socketIoConnection.addEventListener('connect', this.hearSocketConnect, this);
        this.socketIoConnection.addEventListener('connect_error', this.hearSocketConnectError, this);
        this.socketIoConnection.addEventListener('connecting', this.hearSocketConnecting, this);
        this.socketIoConnection.addEventListener('disconnect', this.hearSocketDisconnect, this);
        this.socketIoConnection.addEventListener('error', this.hearSocketError, this);
        this.socketIoConnection.addEventListener('reconnect', this.hearSocketReconnect, this);
        this.socketIoConnection.addEventListener('reconnecting', this.hearSocketReconnecting, this);
        this.socketIoConnection.addEventListener('reconnect_failed', this.hearSocketReconnectFailed, this);
    },

    /**
     * @private
     */
    destroySocket: function() {
        this.socketIoConnection.removeAllListeners();
        this.socketIoConnection = null;
    },

    /**
     * @private
     */
    dispatchConnection: function() {
        this.dispatchEvent(new Event(SocketIoClient.EventTypes.CONNECTION, {
            connection: this.socketIoConnection
        }));
    },

    /**
     * @private
     * @param {Error} error
     */
    dispatchError: function(error) {
        this.dispatchEvent(new Event(SocketIoClient.EventTypes.ERROR, {
            error: error
        }));
    },

    /**
     * @private
     * @param {Error} error
     */
    processSocketError: function(error) {
        this.dispatchEvent(new Event(SocketIoClient.EventTypes.ERROR, {error: error}));
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {NodeJsEvent} event
     */
    hearSocketConnect: function(event) {
        this.isConnected = true;
        this.isConnecting = false;
        console.log('SocketIoClient is connected');
        this.dispatchConnection();
    },

    /**
     * @private
     * @param {NodeJsEvent} event
     */
    hearSocketConnectError: function(event) {
        var error = event.getArguments()[0];
        this.isConnecting = false;
        console.log('SocketIoClient connect_error:', error);
    },

    /**
     * @private
     * @param {NodeJsEvent} event
     */
    hearSocketConnecting: function(event) {
        this.isConnecting = true;
        console.log("SocketIoClient connecting");
    },

    /**
     * @private
     * @param {NodeJsEvent} event
     */
    hearSocketDisconnect: function(event) {
        this.isConnecting = false;
        this.isConnected = false;
        console.log('SocketIoClient disconnected');
    },

    //TODO BRN: Not sure if this fires
    /**
     * @private
     * @param {NodeJsEvent} event
     */
    hearSocketError: function(event) {
        var error = event.getArguments()[0];
        this.isConnecting = false;
        this.processSocketError(error);
    },

    //TODO BRN: Figure out these handlers
    /**
     * @private
     * @param {NodeJsEvent} event
     */
    hearSocketReconnect: function(event) {
        var reconnectCount = event.getArguments()[0];
        this.isConnected = true;
        console.log('SocketIoClient reconnected - reconnectCount:' + reconnectCount);
    },

    /**
     * @private
     * @param {NodeJsEvent} event
     */
    hearSocketReconnecting: function(event) {
        console.log('SocketIoClient reconnecting:');
    },

    /**
     * @private
     * @param {NodeJsEvent} event
     */
    hearSocketReconnectFailed: function(event) {
        console.log('SocketIoClient reconnect_failed');
    }
});


//-------------------------------------------------------------------------------
// Static Variables
//-------------------------------------------------------------------------------

/**
 * @enum {string}
 */
SocketIoClient.EventTypes = {
    CONNECTION: "SocketIoClient:Connection",
    ERROR: "SocketIoClient:Error"
};


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

bugpack.export('socketio:client.SocketIoClient', SocketIoClient);
