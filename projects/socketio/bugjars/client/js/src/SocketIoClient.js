//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('socketio:client')

//@Export('SocketIoClient')

//@Require('Class')
//@Require('EventDispatcher')
//@Require('Proxy')
//@Require('Queue')
//@Require('TypeUtil')
//@Require('socketio:socket.SocketIoEmit')


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
var TypeUtil        = bugpack.require('TypeUtil');
var SocketIoEmit    = bugpack.require('socketio:socket.SocketIoEmit');


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
        this.config             = config;

        /**
         * @private
         * @type {boolean}
         */
        this.connected          = false;

        /**
         * @private
         * @type {boolean}
         */
        this.connecting         = false;

        /**
         * @private
         * @type {*}
         */
        this.socketConnection   = null;

        /**
         * @private
         * @type {ISocketFactory}
         */
        this.socketFactory      = socketFactory;
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
     * @param {string} querystring
     */
    connect: function(querystring) {
        if (!this.isConnected() && !this.isConnecting()) {
            this.connecting = true;
            console.log('SocketIoClient is attempting to connect...');
            if (!this.socketConnection) {
                this.createSocket(querystring);
            } else {
                throw new Error("SocketIoClient already has a connection. Something went wrong!");
            }
        }
        return this.socketConnection;
    },

    //TODO SUNG
    disconnect: function() {
        this.socketConnection.disconnect();
    },


    /**
     * @param {string} querystring
     */
    createSocket: function(querystring) {
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
        var host = this.config.getHost();
        if (TypeUtil.isString(querystring)) {
            host += "?" + querystring
        }
        this.socketConnection = this.socketFactory.createSocketConnection(host, options);
        console.log("socketConnection created:", this.socketConnection);
        this.socketConnection.addEventListener('connect',           this.hearSocketConnect,         this);
        this.socketConnection.addEventListener('connect_error',     this.hearSocketConnectError,    this);
        this.socketConnection.addEventListener('connecting',        this.hearSocketConnecting,      this);
        this.socketConnection.addEventListener('disconnect',        this.hearSocketDisconnect,      this);
        this.socketConnection.addEventListener('error',             this.hearSocketError,           this);
        this.socketConnection.addEventListener('reconnect',         this.hearSocketReconnect,       this);
        this.socketConnection.addEventListener('reconnecting',      this.hearSocketReconnecting,    this);
        this.socketConnection.addEventListener('reconnect_failed',  this.hearSocketReconnectFailed, this);
    },

    /**
     * @private
     */
    destroySocket: function() {
        this.socketConnection = null;
    },

    //-------------------------------------------------------------------------------
    // Private Instance Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    dispatchConnection: function() {
        this.dispatchEvent(new Event(SocketIoClient.EventTypes.CONNECTION, {
            connection: this.socketConnection
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
        this.connected = true;
        this.connecting = false;
        console.log('SocketIoClient is connected');
        this.dispatchConnection();
    },

    /**
     * @private
     * @param {NodeJsEvent} event
     */
    hearSocketConnectError: function(event) {
        var error = event.getArguments()[0];
        this.connecting = false;
        console.log('SocketIoClient connect_error:', error);
    },

    /**
     * @private
     * @param {NodeJsEvent} event
     */
    hearSocketConnecting: function(event) {
        this.connecting = true;
        console.log("SocketIoClient connecting");
    },

    /**
     * @private
     * @param {NodeJsEvent} event
     */
    hearSocketDisconnect: function(event) {
        this.connecting = false;
        this.connected = false;
        this.destroySocket();
        console.log('SocketIoClient disconnected');
    },

    //TODO BRN: Not sure if this fires
    /**
     * @private
     * @param {NodeJsEvent} event
     */
    hearSocketError: function(event) {
        var error = event.getArguments()[0];
        this.connecting = false;
        this.processSocketError(error);
        console.log("SocketIoClient socket error", error);
    },

    //TODO BRN: Figure out these handlers
    /**
     * @private
     * @param {NodeJsEvent} event
     */
    hearSocketReconnect: function(event) {
        var reconnectCount = event.getArguments()[0];
        this.connected = true;
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
