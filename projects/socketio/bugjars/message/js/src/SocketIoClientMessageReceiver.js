//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Export('socketio:client.SocketIoClientChannel')

//@Require('Class')
//@Require('IEventPropagator')
//@Require('Queue')
//@Require('UuidGenerator')
//@Require('bugmessage.IMessageChannel')
//@Require('bugmessage.Message')
//@Require('socketio:client.SocketIoClient')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack                 = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var IEventPropagator        = bugpack.require('IEventPropagator');
var Queue                   = bugpack.require('Queue');
var UuidGenerator           = bugpack.require('UuidGenerator');
var AbstractMessageChannel  = bugpack.require('bugmessage.AbstractMessageChannel');
var IMessageChannel         = bugpack.require('bugmessage.IMessageChannel');
var Message                 = bugpack.require('bugmessage.Message');
var SocketIoClient          = bugpack.require('socketio:client.SocketIoClient');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SocketIoClientChannel = Class.extend(AbstractMessageChannel, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(socketIoClient) {

        this._super();


        //-------------------------------------------------------------------------------
        // Private Properties
        //-------------------------------------------------------------------------------

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
     * @return {IMessageChannel}
     */
    getIncomingMessageChannel: function() {
        return this.incomingMessageChannel;
    },

    /**
     * @param {IMessageChannel} incomingMessageChannel
     */
    setIncomingMessageChannel: function(incomingMessageChannel) {
        if (incomingMessageChannel) {
            this.incomingMessageChannel.removeEventPropagator(this);
        }
        this.incomingMessageChannel = incomingMessageChannel;
        this.incomingMessageChannel.addEventPropagator(this);
    },


    //-------------------------------------------------------------------------------
    // IEventPropagator Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {Event} event
     */
    propagateEvent: function(event) {
        if (!event.isPropagationStopped()) {
            this.socketIoClient.emit("event", {
                eventData: event.getData(),
                eventType: event.getType()
            });
        }
    },


    //-------------------------------------------------------------------------------
    // IMessageChannel Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {Message} message
     * @param {string} channel
     */
    channelMessage: function(message, channel) {
        this.socketIoClient.send({message: message.toObject(), channel: channel});
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Error)} callback
     */
    initialize: function(callback) {
        this.socketIoClient.addEventListener(SocketIoClient.EventTypes.ERROR, this.hearSocketErrorEvent, this);
        this.socketIoClient.addEventListener(SocketIoClient.EventTypes.EVENT, this.hearSocketEventEvent, this);
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

            //TODO BRN: Figure out what to do with the error here..
            console.error(error);

        } else {
            throw new Error("Message Transport received an incompatible error. error:" + error);
        }
    },

    /**
     * @private
     * @param {string} eventType
     * @param {Object} eventData
     */
    processSocketEvent: function(eventType, eventData) {
        this.dispatchEvent(new Event(eventType, eventData));
    },

    /**
     * @private
     * @param {Object} messageObject
     */
    processSocketMessage: function(messageObject) {
        //TODO BRN: Should use BugMarshaller here to perform the conversion
        if (messageObject) {
            var messageObject = messageObject.message;
            var responseChannelObject = messageObject.responseChannel;
            var message = new Message(messageData.topic, messageData.data);
            if (messageData.receiverAddress) {
                message.setReceiverAddress(messageData.receiverAddress);
            }
            if (this.incomingMessageChannel) {
                this.incomingMessageChannel.channelMessage(message, channel);
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
    hearSocketEventEvent: function(event) {
        this.processSocketEvent(event.getData().eventType, event.getData().eventData);
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

Class.implement(SocketIoClientChannel, IEventPropagator);
Class.implement(SocketIoClientChannel, IMessageChannel);


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('socketio:client.SocketIoClientChannel', SocketIoClientChannel);
