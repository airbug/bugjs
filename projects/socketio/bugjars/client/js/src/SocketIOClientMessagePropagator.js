//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('socketio:client')

//@Export('SocketIoClientMessagePropagator')

//@Require('Class')
//@Require('IEventPropagator')
//@Require('IMessagePropagator')
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
var IEventPropagator    = bugpack.require('IEventPropagator');
var IMessagePropagator  = bugpack.require('IMessagePropagator');
var Message             = bugpack.require('Message');
var MessageDefines      = bugpack.require('MessageDefines');
var Obj                 = bugpack.require('Obj');
var Queue               = bugpack.require('Queue');
var UuidGenerator       = bugpack.require('UuidGenerator');
var SocketIoClient      = bugpack.require('socketio:client.SocketIoClient');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SocketIoClientMessagePropagator = Class.extend(Obj, {

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
         * @type {IMessagePropagator}
         */
        this.incomingMessagePropagator = null;

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
     * @return {IMessagePropagator}
     */
    getIncomingMessagePropagator: function() {
        return this.incomingMessagePropagator;
    },

    /**
     * @param {IMessagePropagator} incomingMessagePropagator
     */
    setIncomingMessagePropagator: function(incomingMessagePropagator) {
        if (incomingMessagePropagator) {
            this.incomingMessagePropagator.removeEventPropagator(this);
        }
        this.incomingMessagePropagator = incomingMessagePropagator;
        this.incomingMessagePropagator.addEventPropagator(this);
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
    // IMessagePropagator Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {Message} message
     * @param {string} channel
     */
    propagateMessage: function(message, channel) {
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

            /*var message = new Message("error", error);
            if (this.incomingMessagePropagator) {
                this.incomingMessagePropagator.propagateMessage(message, MessageDefines.MessageChannels.ERROR);
            } else {
                throw new Error("Must set incomingMessageReceiver before it starts hearing events from the client");
            }*/
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
            var messageData = messageObject.message;
            var channel = messageObject.channel;
            var message = new Message(messageData.topic, messageData.data);
            if (messageData.receiverAddress) {
                message.setReceiverAddress(messageData.receiverAddress);
            }
            if (this.incomingMessagePropagator) {
                this.incomingMessagePropagator.propagateMessage(message, channel);
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

Class.implement(SocketIoClientMessagePropagator, IEventPropagator);
Class.implement(SocketIoClientMessagePropagator, IMessagePropagator);


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('socketio:client.SocketIoClientMessagePropagator', SocketIoClientMessagePropagator);
