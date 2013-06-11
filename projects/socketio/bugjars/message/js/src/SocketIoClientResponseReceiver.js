//-------------------------------------------------------------------------------
// Annotations
//-------------------------------------------------------------------------------

//@Package('socketio:client')

//@Export('SocketIoClientResponseReceiver')

//@Require('Class')
//@Require('Map')
//@Require('bugmessage.AbstractResponseReceiver')
//@Require('bugmessage.Response')
//@Require('socketio:client.SocketIoClient')


//-------------------------------------------------------------------------------
// Common Modules
//-------------------------------------------------------------------------------

var bugpack = require('bugpack').context();


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------

var Class                       = bugpack.require('Class');
var Map                         = bugpack.require('Map');
var AbstractResponseReceiver    = bugpack.require('bugmessage.AbstractResponseReceiver');
var Response                    = bugpack.require('bugmessage.Response');
var SocketIoClient              = bugpack.require('socketio:client.SocketIoClient');


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var SocketIoClientResponseReceiver = Class.extend(AbstractResponseReceiver, {

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
         * @type {Map.<string, IResponseChannel>}
         */
        this.responseChannelMap = new Map();

        /**
         * @private
         * @type {SocketIoClient}
         */
        this.socketIoClient = socketIoClient;
    },


    //-------------------------------------------------------------------------------
    // AbstractResponseReceiver Implementation
    //-------------------------------------------------------------------------------

    /**
     * @param {Message} message
     * @param {MessageResponder} messageResponder
     */
    doReceiveResponse: function(message, messageResponder) {
        var responseChannel = messageResponder.getResponseChannel();
        this.responseChannelMap.put(responseChannel.getUuid(), responseChannel);
        this.socketIoClient.send({message: message.toObject(), responseChannel: responseChannel.toObject()});
    },


    //-------------------------------------------------------------------------------
    // Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @param {function(Error)} callback
     */
    initialize: function(callback) {
        this.socketIoClient.addEventListener(SocketIoClient.EventTypes.RESPONSE, this.hearSocketResponseEvent, this);
        callback();
    },


    //-------------------------------------------------------------------------------
    // Private Class Methods
    //-------------------------------------------------------------------------------

    /**
     * @private
     * @param {Object} responseObject
     */
    processSocketResponse: function(responseObject) {
        //TODO BRN: Should use BugMarshaller here to perform the conversion
        if (responseObject) {
            var response = new Response(responseObject.type, responseObject.data);
            var headerMapObject = responseObject.headerMap;
            for (var name in headerMapObject) {
                response.setHeader(name, headerMapObject[name]);
            }
            var responseChannelUuid = response.getHeader("responseChannelUuid");
            var responseChannel = this.responseChannelMap.get(responseChannelUuid);
            responseChannel.channelResponse(response);
        } else {
            throw new Error("SocketIoClientResponseReceiver received an incompatible response. response:" + response);
        }
    },


    //-------------------------------------------------------------------------------
    // Event Listeners
    //-------------------------------------------------------------------------------

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

bugpack.export('socketio:client.SocketIoClientResponseReceiver', SocketIoClientResponseReceiver);
