//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('socketio:client')

//@Export('SocketIoClientMessageChannel')

//@Require('Class')
//@Require('Map')
//@Require('bugmessage.AbstractMessageChannel')
//@Require('bugmessage.Response')
//@Require('socketio:client.SocketIoClient')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                   = bugpack.require('Class');
var Map                     = bugpack.require('Map');
var AbstractMessageChannel  = bugpack.require('bugmessage.AbstractMessageChannel');
var Response                = bugpack.require('bugmessage.Response');
var SocketIoClient          = bugpack.require('socketio:client.SocketIoClient');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SocketIoClientMessageChannel = Class.extend(AbstractMessageChannel, {

    //-------------------------------------------------------------------------------
    // Constructor
    //-------------------------------------------------------------------------------

    _constructor: function(socketIoClient, socketIoClientResponseReceiver) {

        this._super();


        //-------------------------------------------------------------------------------
        // Declare Variables
        //-------------------------------------------------------------------------------

        /**
         * @private
         * @type {SocketIoClient}
         */
        this.socketIoClient = socketIoClient;

        /**
         * @private
         * @type {SocketIoClientResponseReceiver}
         */
        this.socketIoClientResponseReceiver = socketIoClientResponseReceiver;
    },


    //-------------------------------------------------------------------------------
    // AbstractMessageChannel Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {Message} message
     * @param {MessageResponder} messageResponder
     */
    doChannelMessage: function(message, messageResponder) {
        var responseChannel = messageResponder.getResponseChannel();
        this.socketIoClientResponseReceiver.addResponseChannel(responseChannel);
        this.socketIoClient.send({message: message.toObject(), responseChannel: responseChannel.toObject()});
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
        this.socketIoClient.addEventListener(SocketIoClient.EventTypes.RESPONSE, this.hearSocketResponseEvent, this);
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
     * @param {Object} responseObject
     */
    processSocketResponse: function(responseObject) {
        //TODO BRN: Should use BugMarshaller here to perform the conversion
        if (responseObject) {

            var response = new Response(responseObject.type, responseObject.data);
            if (messageData.receiverAddress) {
                message.setReceiverAddress(messageData.receiverAddress);
            }
            if (this.incomingMessageChannel) {
                this.incomingMessageChannel.channelMessage(message, channel);
            } else {
                throw new Error("Must set incomingMessageReceiver before it starts hearing events from the client");
            }
        } else {
            throw new Error("SocketIoClientMessageChannel received an incompatible message. message:" + message);
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
    hearSocketResponseEvent: function(event) {
        this.processSocketResponse(event.getData().response);
    }
});


//-------------------------------------------------------------------------------
// Export
//-------------------------------------------------------------------------------

bugpack.export('socketio:client.SocketIoClientMessageChannel', SocketIoClientMessageChannel);
