//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('SocketIoMessageTransport')

//@Require('Class')
//@Require('IMessageReceiver')
//@Require('Message')
//@Require('MessageDefines')
//@Require('Obj')
//@Require('Queue')
//@Require('UuidGenerator')
//@Require('socketio:client.SocketIoClient')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var IMessageReceiver    = bugpack.require('IMessageReceiver');
var Message             = bugpack.require('Message');
var MessageDefines      = bugpack.require('MessageDefines');
var Obj                 = bugpack.require('Obj');
var Queue               = bugpack.require('Queue');
var UuidGenerator       = bugpack.require('UuidGenerator');
var SocketIoClient      = bugpack.require('socketio:client.SocketIoClient');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SocketIoMessageTransport = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(socketIoClient) {

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
         * @type {SocketIoClient}
         */
        this.socketIoClient = socketIoClient;
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
     * @param {string} channel
     */
    receiveMessage: function(message, channel) {
        if (channel === MessageDefines.MessageChannels.MESSAGE) {
            this.socketIoClient.send(message.toObject());
        } else if (channel == MessageDefines.MessageChannels.ERROR) {
            this.socketIoClient.emit('error', message.toObject());
        } else {
            this.socketIoClient.emit(channel, message.toObject());
        }
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Error)} callback
     */
    initialize: function(callback) {
        this.socketIoClient.addEventListener(SocketIoClient.EventTypes.ERROR, this.hearSocketErrorEvent, this);
        this.socketIoClient.addEventListener(SocketIoClient.EventTypes.MESSAGE, this.hearSocketMessageEvent, this);
        this.socketIoClient.initialize(callback);
    },


    //-------------------------------------------------------------------------------
    // Private Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Error} error
     */
    processSocketError: function(error) {
        //TODO BRN: Should use BugMarshaller here to perform the conversion
        if (error) {
            var message = new Message("error", error);
            if (this.incomingMessageReceiver) {
                this.incomingMessageReceiver.receiveMessage(message, MessageDefines.MessageChannels.ERROR);
            } else {
                throw new Error("Must set incomingMessageReceiver before it starts hearing events from the client");
            }
        } else {
            throw new Error("Message Transport received an incompatible error. error:" + error);
        }
    },

    /**
     * @private
     * @param {Object} messageObject
     */
    processSocketMessage: function(messageObject) {
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
                this.incomingMessageReceiver.receiveMessage(message, MessageDefines.MessageChannels.MESSAGE);
            } else {
                throw new Error("Must set incomingMessageReceiver before it starts hearing events from the client");
            }
        } else {
            throw new Error("Message Transport received an incompatible message. message:" + message);
        }
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Event} event
     */
    hearSocketErrorEvent: function(event) {
        this.processSocketError(event.getData().error);
    },

    /**
     * @private
     * @param {Event} event
     */
    hearSocketMessageEvent: function(event) {
        this.processSocketMessage(event.getData().message);
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
