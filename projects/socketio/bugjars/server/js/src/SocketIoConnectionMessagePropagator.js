//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('socketio:server')

//@Export('SocketIoConnectionMessageChannel')

//@Require('Class')
//@Require('IEventPropagator')
//@Require('IMessageChannel')
//@Require('Message')
//@Require('Obj')
//@Require('Queue')
//@Require('UuidGenerator')
//@Require('socketio:server.SocketIoConnection')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class               = bugpack.require('Class');
var IEventPropagator    = bugpack.require('IEventPropagator');
var IMessageChannel  = bugpack.require('IMessageChannel');
var Message             = bugpack.require('Message');
var Obj                 = bugpack.require('Obj');
var Queue               = bugpack.require('Queue');
var UuidGenerator       = bugpack.require('UuidGenerator');
var SocketIoConnection  = bugpack.require('socketio:client.SocketIoConnection');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SocketIoConnectionMessageChannel = Class.extend(Obj, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(socketIoConnection) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {IMessageChannel}
         */
        this.incomingMessageChannel = null;

        /**
         * @private
         * @type {SocketIoConnection}
         */
        this.socketIoConnection = socketIoConnection;
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
            this.socketIoConnection.emit("event", {
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
        this.socketIoConnection.send({message: message.toObject(), channel: channel});
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Error)} callback
     */
    initialize: function(callback) {
        this.socketIoConnection.addEventListener(SocketIoConnection.EventTypes.ERROR, this.hearSocketErrorEvent, this);
        this.socketIoConnection.addEventListener(SocketIoConnection.EventTypes.EVENT, this.hearSocketEventEvent, this);
        this.socketIoConnection.addEventListener(SocketIoConnection.EventTypes.MESSAGE, this.hearSocketMessageEvent, this);
        this.socketIoConnection.initialize(callback);
    },

    /**
     * @private
     */
    deintialize: function() {
        this.socketIoConnection.removeAllListeners();
        this.socketIoConnection.deinitialize();
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
            var messageData = messageObject.message;
            var channel = messageObject.channel;
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

Class.implement(SocketIoConnectionMessageChannel, IEventPropagator);
Class.implement(SocketIoConnectionMessageChannel, IMessageChannel);


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('socketio:server.SocketIoConnectionMessageChannel', SocketIoConnectionMessageChannel);
