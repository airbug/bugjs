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
         * @type {function()}
         */
        this.initializeCallback = null;

        /**
         * @private
         * @type {boolean}
         */
        this.initializeCallbackFired = false;

        /**
         * @private
         * @type {boolean}
         */
        this.initialized = false;

        /**
         * @private
         * @type {boolean}
         */
        this.isConnected = false;

        /**
         * @private
         * @type {boolean}
         */
        this.isConnecting = false;

        /**
         * @private
         * @type {Queue}
         */
        this.queue = new Queue();

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
         * @type {*}
         */
        this.socket = null;

        /**
         * @private
         * @type {ISocketFactory}
         */
        this.socketFactory = socketFactory;


        //-------------------------------------------------------------------------------
        // Native Listeners
        //-------------------------------------------------------------------------------

        var _this = this;
        this.handleSocketConnect = function() {
            _this.isConnected = true;
            _this.isConnecting = false;
            console.log('SocketIoClient is connected');
            _this.processEmitQueue();
        };

        this.handleSocketConnectError = function(error) {
            _this.isConnecting = false;
            console.log('SocketIoClient connect_error:', error);
        };

        this.handleSocketConnecting = function() {
            console.log("SocketIoClient connecting");
        };

        //TODO BRN: Not sure if this fires
        this.handleSocketDisconnect = function() {
            _this.isConnecting = false;
            _this.isConnected = false;
            console.log('SocketIoClient disconnected');
        };

        //TODO BRN: Not sure if this fires
        this.handleSocketError = function(error) {
            _this.isConnecting = false;
            _this.processSocketError(error);
            _this.retryConnect();
        };

        this.handleSocketMessage = function(message) {
            //TEST
            console.log("SocketIoClient message:", message);
            _this.processSocketMessage(message);
        };

        this.handleSocketReconnect = function(reconnectCount) {
            _this.isConnected = true;
            _this.processEmitQueue();
            console.log('SocketIoClient reconnected - reconnectCount:' + reconnectCount);
        };

        this.handleSocketReconnecting = function() {
            console.log('SocketIoClient reconnecting:');
        };

        this.handleSocketReconnectFailed = function() {
            console.log('SocketIoClient reconnect_failed');
        };
    },

    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {string} emitName
     * @param {Object} emitData
     */
    emit: function(emitName, emitData) {
        if (this.initialized) {
            var emit = new SocketIoEmit(emitName, emitData);
            this.queueEmit(emit);
            if (this.isConnected) {
                this.processEmitQueue();
            } else {
                this.connect();
            }
        } else {
            throw new Error("Must initialize SocketIoClient before calling send()");
        }
    },
    
    /**
     * @param {function} callback
     */
    initialize: function(callback) {
        if (!this.initialized) {
            this.initialized = true;
            this.initializeCallback = callback;
            this.connect();
        } else {
            throw new Error("SonarbugClient has already been initialized.");
        }
    },

    /**
     * @param {Object} messageData
     */
    send: function(messageData) {
        this.emit("message", messageData);
    },



    //-------------------------------------------------------------------------------
    // Private Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Error=} error
     */
    completeInitialization: function(error) {
        if (!this.initializeCallbackFired){
            this.initializeCallbackFired = true;
            if (this.initializeCallback) {
                this.initializeCallback(error);
            }
        }
    },

    /**
     * @private
     */
    connect: function() {
        if (!this.isConnected && !this.isConnecting) {
            this.isConnecting = true;
            console.log('SocketIoClient is attempting to connect...');
            if (this.socket) {
                this.destroySocket();
            }
            this.socket = this.createSocket();
        }
    },

    /**
     * @private
     */
    createSocket: function() {
        var options = {
            port: this.config.getPort(),
            resource: this.config.getResource()
            //   , secure: false
            //   , document: 'document' in global ? document : false,
            //   , transports: io.transports
            //   , 'connect timeout': 10000
            //   , 'try multiple transports': true
            //   , 'reconnect': true
            //   , 'reconnection delay': 500
            //   , 'reconnection limit': Infinity
            //   , 'reopen delay': 3000
            //   , 'max reconnection attempts': 10
            //   , 'sync disconnect on unload': false
            //   , 'auto connect': true
            //   , 'flash policy port': 10843
            //   , 'manualFlush': false
        };
        this.socket = this.socketFactory.createSocket(this.config.getHost(), options);
        this.socket.on('connect', this.handleSocketConnect);
        this.socket.on('connect_error', this.handleSocketConnectError);
        this.socket.on('connecting', this.handleSocketConnecting);
        this.socket.on('disconnect', this.handleSocketDisconnect);
        this.socket.on('error', this.handleSocketError);
        this.socket.on('message', this.handleSocketMessage);
        this.socket.on('reconnect', this.handleSocketReconnect);
        this.socket.on('reconnecting', this.handleSocketReconnecting);
        this.socket.on('reconnect_failed', this.handleSocketReconnectFailed)
    },

    /**
     * @private
     */
    destroySocket: function() {
        this.socket.removeAllListeners();
        this.socket = null;
    },

    /**
     * @private
     */
    processEmitQueue: function() {
        while (!this.queue.isEmpty() && this.isConnected){
            var socketIoEmit = this.queue.dequeue();
            if (socketIoEmit.getName() === "message") {
                this.socketSend(socketIoEmit);
            } else {
                this.socketEmit(socketIoEmit);
            }
        }
    },

    /**
     * @private
     * @param {Error} error
     */
    processSocketError: function(error) {
        this.dispatchEvent(new Event(SocketIoClient.EventTypes.ERROR, {error: error}));
    },

    /**
     * @private
     * @param {Object} message
     */
    processSocketMessage: function(message) {
        this.dispatchEvent(new Event(SocketIoClient.EventTypes.MESSAGE, {message: message}));
    },

    /**
     * @private
     * @param {SocketIoEmit} socketIoEmit
     */
    queueEmit: function(socketIoEmit) {
        this.queue.enqueue(socketIoEmit);
    },

    /**
     * @private
     */
    retryConnect: function() {
        if (this.retryAttempts < this.retryLimit) {
            this.retryAttempts++;
            this.connect();
        } else {
            this.completeInitialization(new Error("Maximum retries reached. Could not connect to sonarbug server."));
        }
    },

    /**
     * @private
     * @param {SocketIoEmit} socketIoEmit
     */
    socketEmit: function(socketIoEmit) {
        this.socket.emit(socketIoEmit.getName(), socketIoEmit.getData());
    },
    
    /**
     * @private
     * @param {SocketIoEmit} socketIoEmit
     */
    socketSend: function(socketIoEmit) {
        this.socket.send(socketIoEmit.getData());
    }
});


//-------------------------------------------------------------------------------
// Static Variables
//-------------------------------------------------------------------------------

/**
 * @enum {string}
 */
SocketIoClient.EventTypes = {
    ERROR: "SocketIoClient:Error",
    MESSAGE: "SocketIoClient:Message"
};


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

bugpack.export('socketio:client.SocketIoClient', SocketIoClient);
