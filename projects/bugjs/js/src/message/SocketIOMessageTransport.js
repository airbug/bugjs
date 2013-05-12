//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('SocketIoMessageTransport')

//@Require('Class')
//@Require('IMessageReceiver')
//@Require('Message')
//@Require('Obj')
//@Require('Queue')
//@Require('UuidGenerator')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();
var io =        require('socket.io-client');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var IMessageReceiver    = bugpack.require('IMessageReceiver');
var Message             = bugpack.require('Message');
var Obj                 = bugpack.require('Obj');
var Queue           = bugpack.require('Queue');
var UuidGenerator       = bugpack.require('UuidGenerator');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SocketIoMessageTransport = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(transport) {

        var _this = this;
        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {string}
         */
        this.address = UuidGenerator.generateUuid();

        /**
         * @private
         * @type {MessageReceiver}
         */
        this.incomingMessageReceiver = null;


        /**
         * @private
         * @type {?string}
         */
        this.hostname = null;

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
         * @type {Set}
         */
        this.messageChannels = new Set();

        /**
         * @private
         * @type {Queue}
         */
        this.messageQueue = new Queue();

        /**
         * @private
         * @type {?number}
         */
        this.port = null;

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


        this.handleSocketConnect = function() {
            _this.isConnected = true;
            _this.isConnecting = false;
            console.log('SocketIoTransport is connected');
            _this.processMessageQueue();
        };

        this.handleSocketConnectError = function(error) {
            _this.isConnecting = false;
            console.log('SocketIoTransport connect_error:', error);
        };

        this.handleSocketConnecting = function() {
            console.log("SocketIoTransport connecting");
        };

        //TODO BRN: Not sure if this fires
        this.handleSocketDisconnect = function() {
            _this.isConnecting = false;
            _this.isConnected = false;
            console.log('SocketIoTransport disconnected');
        };

        //TODO BRN: Not sure if this fires
        this.handleSocketError = function(error) {
            _this.isConnecting = false;
            _this.processSocketError(error);
        };

        this.handleSocketMessage = function(message) {
            //TEST
            console.log("SocketIoTransport message:", message);
            _this.processSocketMessage(message, "message");
        };

        this.handleSocketReconnect = function(reconnectCount) {
            _this.isConnected = true;
            _this.processTrackingQueue();
            console.log('SocketIoTransport reconnected - reconnectCount:' + reconnectCount);
        };

        this.handleSocketReconnecting = function() {
            console.log('SocketIoTransport reconnecting:');
        };

        this.handleSocketReconnectFailed = function() {
            console.log('SocketIoTransport reconnect_failed');
        };
    },


    //-------------------------------------------------------------------------------
    // Getters and Setters
    //-------------------------------------------------------------------------------

    /**
     * @return {MessageReceiver}
     */
    getIncomingMessageReceiver: function() {
        return this.incomingMessageReceiver;
    },

    /**
     * @param {MessageReceiver} incomingMessageReceiver
     */
    setIncomingMessageReceiver: function(incomingMessageReceiver) {
        this.incomingMessageReceiver = incomingMessageReceiver;
    },


    //-------------------------------------------------------------------------------
    // IMessageReceiver Implementation
    //-------------------------------------------------------------------------------

    /**
     * @return {string}
     */
    getAddress: function() {
        return this.address;
    },

    /**
     * @param {Message} message
     */
    receiveMessage: function(message) {
        this.queueMessage(message);
        if (this.isConnected){
            this.processMessageQueue();
        }
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    configure: function(config) {
        if (config) {
            this.hostname = config.hostname ? config.hostname : this.hostname;
            this.port = config.port ? config.port : this.port;
        }
    },


    //-------------------------------------------------------------------------------
    // Private Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     */
    connect: function() {
        if (!this.isConnected && !this.isConnecting) {
            this.isConnecting = true;
            console.log('CallManager is attempting to connect...');
            this.createSocket();
        }
    },

    /**
     * @private
     */
    createSocket: function() {
        var options = {
            port: this.port
            //   , secure: false
            //   , document: 'document' in global ? document : false,
            //resource: 'socket-api' // defaults to 'socket.io'
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
        this.socket = io.connect(this.hostname, options);
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
     * @param {Message} message
     */
    emitMessageOnSocket: function(message) {
        this.socket.send(message.toObject());
    },

    /**
     * @private
     */
    processMessageQueue: function() {
        while (!this.messageQueue.isEmpty() && this.isConnected){
            var message = this.queue.dequeue();
            this.emitMessageOnSocket(message);
        }
    },

    /**
     * @private
     * @param {Object} messageObject
     * @param {string} channel
     */
    processSocketMessage: function(messageObject, channel) {
        //TODO BRN: Should use BugMarshaller here to perform the conversion
        if (messageObject) {
            var message = new Message(messageObject.topic, messageObject.data);
            if (messageObject.destinationAddress) {
                message.setDestinationAddress(messageObject.destinationAddress);
            }
            if (messageObject.returnAddress) {
                message.setReturnAddress(messageObject.returnAddress);
            }
            if (this.incomingMessageReceiver) {
                this.incomingMessageReceiver.receiveMessage(message);
            } else {
                throw new Error("Must set incomingMessageReceiver before it starts hearing events from the transport");
            }
        } else {
            throw new Error("Message Transport received an incompatible message. message:" + message);
        }
    },

    /**
     * @private
     * @param {Message} message
     */
    queueMessage: function(message) {
        this.queue.enqueue(message);
    }
});


//-------------------------------------------------------------------------------
// Interfaces
//-------------------------------------------------------------------------------

Class.implement(SocketIoMessageTransport, IMessageReceiver);


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('SocketIoMessageTransport', SocketIoMessageTransport);
